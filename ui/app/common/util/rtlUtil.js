'use strict';

angular.module('bahmni.common.util')
    .service('rtlUtil', [function () {
        // RTL language codes
        var rtlLanguages = ['ar', 'he', 'fa', 'ur', 'yi'];

        /**
         * Check if a locale is RTL
         * @param {string} locale - Locale code (e.g., 'ar', 'ar_SA', 'en')
         * @returns {boolean} - True if locale is RTL
         */
        this.isRTL = function (locale) {
            if (!locale) {
                locale = window.localStorage["NG_TRANSLATE_LANG_KEY"] || "en";
            }
            // Extract language code (e.g., 'ar' from 'ar_SA' or 'ar-SA')
            var langCode = locale.split('_')[0].split('-')[0].toLowerCase();
            return rtlLanguages.indexOf(langCode) !== -1;
        };

        /**
         * Get text direction for a locale
         * @param {string} locale - Locale code
         * @returns {string} - 'rtl' or 'ltr'
         */
        this.getDirection = function (locale) {
            return this.isRTL(locale) ? 'rtl' : 'ltr';
        };

        /**
         * Load RTL CSS file if needed
         * @param {string} cssPath - Path to the CSS file (without .rtl.css extension)
         */
        this.loadRTLCSS = function (cssPath) {
            var locale = window.localStorage["NG_TRANSLATE_LANG_KEY"] || "en";
            if (this.isRTL(locale)) {
                var rtlCssPath = cssPath.replace(/\.css$/, '.rtl.css');
                // Check if link already exists
                var existingLink = document.querySelector('link[href="' + rtlCssPath + '"]');
                if (!existingLink) {
                    var link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = rtlCssPath;
                    link.setAttribute('data-rtl', 'true');
                    document.head.appendChild(link);
                }
            }
        };
    }]);

