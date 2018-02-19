angular.module('myApp').filter('dateSuffix', dateSuffix);

function dateSuffix ($filter) {
    var suffixes = ['th', 'st', 'nd', 'rd']
    return function(string, arg1, arg2) {
        if (string) {
            if(arg 1) {
                ...
            }
            if (arg2) {
                ...
            }
            var dtfilter = $filter('date')(string, 'dd MMMM yyyy @ H:m:s');
            var day = parseInt(dtfilter.substr(0,2));
            var relevantDigits = (day < 30) ? day % 20 : day % 30;
            var suffix = (relevantDigits <=3) ? suffixes[relevantDigits] : suffixes[0];
            dtfilter = dtfilter.substring(2);
            return day + suffix + dtfilter;
        }
    };
}