/**
 * RTL Testing Console Script
 * Copy and paste this into your browser console on the Bahmni application
 */

(function() {
    console.log('=== Bahmni RTL Status Check ===\n');

    // Get current locale
    var locale = localStorage.getItem("NG_TRANSLATE_LANG_KEY") || "en";
    var htmlDir = document.documentElement.getAttribute('dir') || 'ltr';
    var htmlLang = document.documentElement.getAttribute('lang') || locale;

    // RTL language codes
    var rtlLanguages = ['ar', 'he', 'fa', 'ur', 'yi'];
    var langCode = locale.split('_')[0].split('-')[0].toLowerCase();
    var isRTL = rtlLanguages.indexOf(langCode) !== -1;

    // Check RTL CSS files
    var rtlLinks = document.querySelectorAll('link[data-rtl="true"]');
    var allCssLinks = document.querySelectorAll('link[rel="stylesheet"]');

    console.log('📋 Current Status:');
    console.log('  Locale:', locale);
    console.log('  Language Code:', langCode);
    console.log('  HTML dir:', htmlDir);
    console.log('  HTML lang:', htmlLang);
    console.log('  Is RTL Language:', isRTL ? '✅ Yes' : '❌ No');
    console.log('  Expected dir:', isRTL ? 'rtl' : 'ltr');
    console.log('  Actual dir:', htmlDir);
    console.log('  Status:', (isRTL && htmlDir === 'rtl') || (!isRTL && htmlDir === 'ltr') ? '✅ Correct' : '⚠️ Mismatch');

    console.log('\n📦 CSS Files:');
    console.log('  Total CSS files:', allCssLinks.length);
    console.log('  RTL CSS files loaded:', rtlLinks.length);

    if (rtlLinks.length > 0) {
        console.log('\n  RTL CSS Files:');
        Array.from(rtlLinks).forEach(function(link, index) {
            console.log('    ' + (index + 1) + '. ' + link.href);
        });
    } else if (isRTL) {
        console.log('  ⚠️ Warning: RTL is active but no RTL CSS files found!');
    }

    console.log('\n🔧 Quick Actions:');
    console.log('  To switch to Arabic:');
    console.log('    localStorage.setItem("NG_TRANSLATE_LANG_KEY", "ar"); location.reload();');
    console.log('  To switch to English:');
    console.log('    localStorage.setItem("NG_TRANSLATE_LANG_KEY", "en"); location.reload();');
    console.log('  To check RTL utility:');
    console.log('    angular.element(document.body).injector().get("rtlUtil").isRTL("ar")');

    // Check if angular is available
    if (typeof angular !== 'undefined') {
        try {
            var injector = angular.element(document.body).injector();
            if (injector) {
                var rtlUtil = injector.get('rtlUtil');
                console.log('\n🔍 RTL Utility Test:');
                console.log('  rtlUtil.isRTL("ar"):', rtlUtil.isRTL('ar'));
                console.log('  rtlUtil.isRTL("en"):', rtlUtil.isRTL('en'));
                console.log('  rtlUtil.getDirection("ar"):', rtlUtil.getDirection('ar'));
                console.log('  rtlUtil.getDirection("en"):', rtlUtil.getDirection('en'));
            }
        } catch (e) {
            console.log('\n⚠️ Could not access RTL utility (app may not be fully loaded)');
        }
    }

    console.log('\n✅ Check complete!');
})();

