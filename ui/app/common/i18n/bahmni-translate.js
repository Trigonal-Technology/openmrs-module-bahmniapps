'use strict';

angular.module('bahmni.common.i18n', ['pascalprecht.translate', 'bahmni.common.util'])
    .provider('$bahmniTranslate', ['$translateProvider', function ($translateProvider) {
        this.init = function (options) {
            var preferredLanguage = window.localStorage["NG_TRANSLATE_LANG_KEY"] || "en";
            $translateProvider.useLoader('mergeLocaleFilesService', options);
            $translateProvider.useSanitizeValueStrategy('escaped');
            $translateProvider.preferredLanguage(preferredLanguage);
            $translateProvider.useLocalStorage();
        };
        this.$get = [function () {
            return $translateProvider;
        }];
    }
    ])
    .filter('titleTranslate', ['$translate', function ($translate) {
        return function (input) {
            if (!input) {
                return input;
            }
            if (input.translationKey) {
                return $translate.instant(input.translationKey);
            }
            if (input.dashboardName) {
                return input.dashboardName;
            }
            if (input.title) {
                return input.title;
            }
            if (input.label) {
                return input.label;
            }
            if (input.display) {
                return input.display;
            }
            return $translate.instant(input);
        };
    }])
    .run(['$rootScope', '$translate', '$timeout', 'rtlUtil', function ($rootScope, $translate, $timeout, rtlUtil) {
        var updateDirection = function () {
            var locale = $translate.use() || window.localStorage["NG_TRANSLATE_LANG_KEY"] || "en";
            var direction = rtlUtil.getDirection(locale);
            document.documentElement.setAttribute('dir', direction);
            document.documentElement.setAttribute('lang', locale);

            // Load RTL CSS if needed
            if (direction === 'rtl') {
                // Load RTL CSS for main stylesheets
                var styleSheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-rtl])');
                styleSheets.forEach(function (link) {
                    var href = link.getAttribute('href');
                    if (href && href.endsWith('.css') && !href.endsWith('.rtl.css')) {
                        var rtlHref = href.replace(/\.css$/, '.rtl.css');
                        // Check if RTL version exists (will be loaded by the app)
                        var rtlLink = document.createElement('link');
                        rtlLink.rel = 'stylesheet';
                        rtlLink.href = rtlHref;
                        rtlLink.setAttribute('data-rtl', 'true');
                        rtlLink.onerror = function () {
                            // If RTL CSS doesn't exist, remove the link
                            document.head.removeChild(rtlLink);
                        };
                        document.head.appendChild(rtlLink);
                    }
                });
            } else {
                // Remove RTL CSS links for LTR
                var rtlLinks = document.querySelectorAll('link[data-rtl="true"]');
                rtlLinks.forEach(function (link) {
                    document.head.removeChild(link);
                });
            }
        };

        // Update on locale change
        $rootScope.$on('$translateChangeSuccess', updateDirection);

        // Initial update
        $rootScope.$on('$translateChangeEnd', updateDirection);

        // Also update immediately if translate is already loaded
        $timeout(updateDirection, 100);
    }]);
