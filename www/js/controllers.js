/*global angular, console, $, alert*/
/*jslint plusplus: true*/

(function () {
    'use strict';

    var shttrControllers = angular.module('shttrControllers', []);
    
    /* SERVICES */
    shttrControllers.service('SharedProperties', function () {
        var user_email, user_name, user_password_hash;
        
        var logged_in = false;
        
        this.setUserFields = function (result) {
            user_email = result.email;
            user_name = result.username;
            user_password_hash = result.password;
            
            logged_in = true;
        };
        
        this.getUserFields = function () {
            return {
                user_email: user_email,
                user_name: user_name,
                user_password_hash: user_password_hash,
            }
        };
        
        this.delUserFields = function () {
            user_email = null;
            user_name = null;
            user_password_hash = null;
            
            logged_in = false;
        }
        
        this.getLoginStatus = function () {
            return logged_in;
        };
        
    });
    
    shttrControllers.service('MapService', function MapService($window) {
        var localStorage = $window.localStorage || {};
        var service = {
            getView: getView,
            setView: setView,
            mapDefaults: mapDefaults,
            controlDefaults: controlDefaults
        };
        return service;
          
        ////////////////////
        function getView() {
            var view = localStorage.mapView;
            if (typeof view != 'undefined') {
                view = $window.JSON.parse(view || '');
                return view;
            } else {
                return {
                    lat: 33.7,
                    lng: -117.8,
                    zoom: 10
                };
            }
        }
        function setView(view) {
            localStorage.mapView = $window.JSON.stringify(view);
        }
        function controlDefaults() {
            return {
                zoom: true,
                fullscreen: true,
                layers: true,
                scale: true,
                measure: false,
                loading: true,
                coordinate: false,
                zoomBox: false,
                bookmarks: false,
                draw: false
            };
        }
        function mapDefaults() {
            return {
                // Default
                center: [33.7, -117.8],
                zoom: 10,
                //layers: layers
                minZoom: undefined,
                maxZoom: undefined,
                maxBounds: undefined,
                dragging: true,
                touchZoom: true,
                scrollWheelZoom: true,
                doubleClickZoom: true,
                boxZoom: true,
                trackResize: true,
                closePopupOnClick: true,
                zoomControl: false,
                attributionControl: false
            };
        }
    });
    
    /* VIEW CONTROLLERS */
    shttrControllers.run(function ($rootScope) {});
    
    shttrControllers.controller('indexCtrl', ['$scope', '$http', '$location', '$window', '$resource', 'SharedProperties', '$compile', '$timeout', function ($scope, $http, $location, $window, $resource, SharedProperties, $compile, $timeout) {
        
        $scope.loginModal = function () {
            document.querySelector('#loginModal').click();
        };
        
        $scope.logoutModal = function () {
            document.querySelector('#logoutModal').click();
        };
        
        $scope.changeToolbar = function () {
            
            if (SharedProperties.getLoginStatus()) {
                
                var help_block = document.getElementById('help-list-obj');
                
                var parent = document.getElementById('nav-list');
                var child_1 = document.getElementById('login-list-obj');
                try {
                    parent.removeChild(child_1);
                } catch(err) {
                    console.log(err.message);
                };
                
                var new_child_1 = document.createElement('li');
                new_child_1.setAttribute('id', 'logout-list-obj');
                new_child_1.innerHTML += "<a id='collapse-link' href ng-click='logoutModal()'><span id='sub-span'><span class='glyphicon glyphicon-log-out' aria-hidden='true'></span> Logout</span></a>";
                parent.insertBefore(new_child_1, help_block);
                $compile(new_child_1)($scope);
                
                var new_child_2 = document.createElement('li');
                new_child_2.setAttribute('id', 'library-list-obj');
                new_child_2.innerHTML += "<a id='collapse-link' href='#/library'><span id='sub-span'><span class='glyphicon glyphicon-book' aria-hidden='true'></span> Library</span></a>";
                parent.insertBefore(new_child_2, new_child_1);
                
                var new_child_3 = document.createElement('li');
                new_child_3.setAttribute('id', 'profile-list-obj');
                new_child_3.innerHTML += "<a id='collapse-link' href='#/profile' class='profile-link'><span id='sub-span'><span class='glyphicon glyphicon-user' aria-hidden='true'></span> Profile</span></a>";
                parent.insertBefore(new_child_3, new_child_2);
                
            } else {
                
                var help_block = document.getElementById('help-list-obj');
                
                var parent = document.getElementById('nav-list');
                var child_1 = document.getElementById('logout-list-obj');
                try {
                    parent.removeChild(child_1);
                } catch(err) {
                    console.log(err.message);
                };
                var child_2 = document.getElementById('profile-list-obj');
                try {
                    parent.removeChild(child_2);
                } catch(err) {
                    console.log(err.message);
                };
                
                var new_child_1 = document.createElement('li');
                new_child_1.setAttribute('id', 'login-list-obj');
                new_child_1.innerHTML += "<a id='collapse-link' href ng-click='loginModal()'><span id='sub-span'><span class='glyphicon glyphicon-log-in' aria-hidden='true'></span> Login</span></a>";
                parent.insertBefore(new_child_1, help_block);
                $compile(new_child_1)($scope);
                
            };
            
        };
        
        $scope.init = function () {
            $scope.changeToolbar();
        };
    }]);
    
    shttrControllers.controller('homeCtrl', ['$scope', '$location', 'SharedProperties', '$window', 'MapService', function ($scope, $location, SharedProperties, $window, MapService) {
        
        $scope.searchQuery = null;
        $scope.searchType = null;
        
        $scope.location = $location;
        
        $scope.init = function () {
            
            var vm = this;
            var L = $window.L;
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    $scope.$apply(function(){
                        
                        var mapOptions = MapService.mapDefaults();

                        $scope.position = position;
                        console.log($scope.position["coords"]["latitude"])
                        console.log($scope.position["coords"]["longitude"])

                        $scope.user_latitude = $scope.position["coords"]["latitude"]
                        $scope.user_longitude = $scope.position["coords"]["longitude"]

                        vm.map = L.map("mapid", {
                            center: [$scope.user_latitude, $scope.user_longitude],
                            zoom: 20,
                            //layers: layers
                            minZoom: undefined,
                            maxZoom: undefined,
                            maxBounds: undefined,
                            dragging: true,
                            touchZoom: true,
                            scrollWheelZoom: true,
                            doubleClickZoom: true,
                            boxZoom: true,
                            trackResize: true,
                            closePopupOnClick: true,
                            zoomControl: true,
                            attributionControl: false
                        }); 
                        
                        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                            maxZoom: 18,
                            id: 'mapbox.streets',
                            accessToken: 'pk.eyJ1Ijoic3VwZXJyYXB0b3IiLCJhIjoiY2pzcnpqMHA4MHJyZjQ0bzQ1MXdqcmJkOSJ9.B_Zl4HmHKNoIBsyUQXnwZA'
                        }).addTo(vm.map);
                        
                        //vm.map.on('click', onMapClick);
                        //var popup = new L.Popup();
                        
                        var toiletIcon = L.icon({
                            iconUrl: './img/toilet_image.png',

                            iconSize:     [95, 95], // size of the icon
                            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                        });

                        var example_marker = L.marker([39.1339842, -84.5143028], {icon: toiletIcon}).on('click', onMarkerClick).addTo(vm.map);
                        // example_marker.bindPopup("This is a sample marker.").openPopup();
                        
                        /* function onMapClick(e) {
                            var latlngStr = '(' + e.latlng.lat.toFixed(3) + ', ' + e.latlng.lng.toFixed(3) + ')';

                            popup.setLatLng(e.latlng);
                            popup.setContent("You clicked the map at " + latlngStr);

                            vm.map.openPopup(popup);
                        } */
                        
                        function onMarkerClick(e) {
                            console.log("HERE");
                            $("#slide-container").animate({ "margin-right": 0 }, "slow");
                        };
                        
                    });
                });
            } else {
                
                var mapOptions = MapService.mapDefaults();
                
                vm.map = L.map("mapid", {
                    center: [33.7, -117.8],
                    zoom: 10,
                    //layers: layers
                    minZoom: undefined,
                    maxZoom: undefined,
                    maxBounds: undefined,
                    dragging: true,
                    touchZoom: true,
                    scrollWheelZoom: true,
                    doubleClickZoom: true,
                    boxZoom: true,
                    trackResize: true,
                    closePopupOnClick: true,
                    zoomControl: true,
                    attributionControl: false
                });
                
                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1Ijoic3VwZXJyYXB0b3IiLCJhIjoiY2pzcnpqMHA4MHJyZjQ0bzQ1MXdqcmJkOSJ9.B_Zl4HmHKNoIBsyUQXnwZA'
                }).addTo(vm.map);
                
                vm.map.on('click', onMapClick);
                var popup = new L.Popup();

                function onMapClick(e) {
                    var latlngStr = '(' + e.latlng.lat + ', ' + e.latlng.lng + ')';

                    popup.setLatLng(e.latlng);
                    popup.setContent("You clicked the map at " + latlngStr);

                    vm.map.openPopup(popup);
                }
                
            }
                        
            $scope.searchQuery = $location.search().query;
            $scope.searchType = $location.search().search_type;
            
            if ($scope.searchQuery && $scope.searchType) {
                
                $scope.searchDict = {};
                if (SharedProperties.getLoginStatus()) {
                    $scope.searchDict = {
                        search_query: $scope.searchQuery,
                        search_type: $scope.searchType,
                        user: SharedProperties.getUserFields()
                    };
                } else {
                    $scope.searchDict = {
                        search_query: $scope.searchQuery,
                        search_type: $scope.searchType,
                        user: null
                    };
                }
            }
        };
        
        /* Use query to create a new URL for search. */
        $scope.searchFunction = function (searchQuery, searchType) {
            $scope.location = $scope.location.url("/home?query=" + searchQuery + "&search_type=" + searchType);
        };
        
        /* Use to close info area. */
        $scope.closeSlideContainer = function (e) {
            $("#slide-container").animate({ "margin-right": -400 }, "slow");
        };
        
    }]);
        
    shttrControllers.controller('createProfileCtrl', ['$scope', '$http', '$resource', 'SharedProperties', '$timeout', '$location', function ($scope, $http, $resource, SharedProperties, $timeout, $location) {
        
        $scope.GoHome = function () {
            $location.path("/");
        };
        
        $scope.CreateProfile = function (username, email, password, repeat_password) {
            $scope.username = username;
            $scope.email = email;
            $scope.password = password;
            $scope.repeat_password = repeat_password;
            
            /* Add check for if username or email is blank. */
            if ($scope.password == $scope.repeat_password) {
                
                create_profile($scope.username, $scope.email, $scope.password, function(results) {

                    console.log(results);
                    
                    login($scope.username, $scope.password, function(results) {
                        SharedProperties.setUserFields(results);
                        $timeout(function() {
                            $('#index-ctrl-init-span').click();
                        }, 1);
                        $timeout(function() {
                            $('.profile-link').click();
                        }, 1);
                        $location.path("/profile");
                    });
                });

            } else {
                console.log("Passwords don't match!");
            };
        }
        
    }]);
    
    shttrControllers.controller('editProfileCtrl', ['$scope', '$http', '$resource', 'SharedProperties', '$window', '$location', '$timeout', function ($scope, $http, $resource, SharedProperties, $window, $location, $timeout) {
        
        $scope.init = function () {
            $scope.user_fields = SharedProperties.getUserFields();
            
            console.log($scope.user_fields);
            
            $scope.email = $scope.user_fields.user_email;
            $scope.password = $scope.user_fields.user_password_hash;
            $scope.user_name = $scope.user_fields.user_name;
        };
        
        $scope.GoToProfile = function () {
            $location.path("/profile");
        };
        
        /* FIX EVERYTHING BELOW!!!! */
        /* Reset user fields, redirect to profile, etc. ... */
        $scope.EditProfile = function(username, email, current_password, new_password, repeat_new_password) {
            // New fields. Figure this out? Also need to check that these are the same.
            $scope.current_password = current_password
            $scope.new_password = new_password;
            $scope.repeat_new_password = repeat_new_password;
            
            if ($scope.new_password) {
                console.log("Checking new password...");
            } else {
                $scope.new_password = $scope.current_password;
                $scope.repeat_new_password = $scope.current_password;
            };
            
            $scope.email = email;
            $scope.user_name = username;
            
            /* Add check for if username or email is blank. */
            if ($scope.new_password == $scope.repeat_new_password) {
            
                edit_profile($scope.user_name, $scope.email, $scope.current_password, $scope.new_password, $scope.new_repeat_password, function(results) {

                    console.log(results);
                    SharedProperties.setUserFields(results); // Set the user fields again. ALL OF THEM.
                    $scope.set_stuff = SharedProperties.getUserFields(results);
                    $timeout(function() {
                        $('.profile-link').click();
                    }, 1);
                    $location.path("/profile");
                });
                
            } else {
                console.log("Passwords don't match!");
            };
        };
    }]);
    
    shttrControllers.controller('profileCtrl', ['$scope', 'SharedProperties', '$location', function ($scope, SharedProperties, $location) {
        
        $scope.init = function () {
            $scope.user_fields = SharedProperties.getUserFields();
            
            $scope.email = $scope.user_fields.user_email;
            $scope.user_name = $scope.user_fields.user_name;
        };
        
        $scope.deleteModal = function () {
            document.querySelector('#deleteModal').click();
        };
        
        $scope.editProfile = function () {
            $location.path("/edit_profile");
        };
        
    }]);
        
    shttrControllers.controller('helpCtrl', ['$scope', function ($scope) {}]);
        
    shttrControllers.controller('aboutCtrl', ['$scope', function ($scope) {}]);
    
    /* MODAL CONTROLLERS */
    shttrControllers.controller('loginCtrl', ['$scope', '$http', '$resource', 'SharedProperties', '$window', '$location', '$timeout', function ($scope, $http, $resource, SharedProperties, $window, $location, $timeout) {
        
        $scope.init = function () {
        };
        
        $scope.keygen = function(key_len) {
            var i, key = "";
            var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var charactersLength = characters.length;
            
            for (i = 0; i < key_len; i++) {
                key += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
            };
            
            return key;
        };
        
        $scope.login = function(user, password) {
            login(user, password, function(results) {
                SharedProperties.setUserFields(results);
                $timeout(function() {
                    $('#index-ctrl-init-span').click();
                }, 1);
                $timeout(function() {
                    $('#login-close-button').click();
                }, 1);
                $location.path("/profile");
            });
        };
        
    }]);
    
    shttrControllers.controller('logoutCtrl', ['$scope', '$http', '$resource', 'SharedProperties', '$window', '$location', '$timeout', function ($scope, $http, $resource, SharedProperties, $window, $location, $timeout) {
        
        $scope.init = function () {
        };
        
        $scope.logout = function() {
            SharedProperties.delUserFields();
            $timeout(function() {
                $('#index-ctrl-init-span').click();
            }, 1);
            $timeout(function() {
                $('#logout-close-button').click();
            }, 1);
            $location.path("/home");
        };
        
    }]);
    
    shttrControllers.controller('deleteProfileCtrl', ['$scope', '$http', '$resource', 'SharedProperties', '$window', '$location', '$timeout', function ($scope, $http, $resource, SharedProperties, $window, $location, $timeout) {
        
        $scope.init = function () {
        };
        
        $scope.delete = function() {
            $scope.user_fields = SharedProperties.getUserFields();
            
            $scope.email = $scope.user_fields.user_email;
            $scope.password = $scope.user_fields.user_password_hash;
            $scope.user_name = $scope.user_fields.user_name;
            
            delete_profile($scope.user_name, $scope.email, $scope.password, function(results) {
                SharedProperties.delUserFields();
                $timeout(function() {
                    $('#index-ctrl-init-span').click();
                }, 1);
                $timeout(function() {
                    $('#logout-close-button').click();
                }, 1);
                $location.path("/home");
            });
        };
    }]);
    
}());