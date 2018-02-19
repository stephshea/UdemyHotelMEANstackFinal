//service uses new function keyword; factory does something better...call these functions in the controllers
//contains all http gets in app
angular.module('meanhotel').factory('hotelDataFactory', hotelDataFactory);
function hotelDataFactory($http) {
    return {
       hotelList: hotelList,
       hotelDisplay: hotelDisplay,
       postReview: postReview 
    };

    function hotelList() { 
        return $http.get('/api/hotels?count=15').then(complete).catch(failed);
        //used to create hotel list of links on main page
        //injected into hotelListcontroller
    }
    
    function hotelDisplay(hotelId) {
        return $http.get('/api/hotels/' + hotelId).then(complete).catch(failed);
    //used to display one hotel with details on hotel.html
    //injected into hotelDisplaycontroller
    }

    function postReview(hotelId, review) {
         return $http.post('/api/hotels/' + hotelId + '/reviews', review).then(complete).catch(failed);
        
    }
    
    function complete(response) {
        return response;
    }
    
    function failed(error) {
        console.log(error.statusText);
    }
    
  
}

//response.DATA in controllers