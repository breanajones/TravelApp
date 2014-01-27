'use strict';


/* Controllers */

angular.module('roApp.controllers', [])
    .controller('BaseController', ['$scope', '$window', 'brand', 'SessionService', function ($scope, $window, brand, SessionService) {
        $scope.brand = brand;

        $scope.doLogout = function () {
            SessionService.removeSession();
            $window.location = '/';
        };
    }])

    .controller('DragnDropCtrl', function($scope) {
            $scope.image = null
            $scope.imageFileName = ''
        })
    .controller('LoginController', ['$scope', 'SessionService', 'Restangular', function($scope, SessionService, Restangular) {
        $scope.session = SessionService.getSession();
        $scope.user = {};
        $scope.$on('event:login-confirmed', function () {
            console.log('event has been broadcast to Home Controller');
            $scope.session = SessionService.getSession();
        });
    }])

    .controller('CreateLocationController', ['$scope', '$http', 'SessionService', 'Restangular', '$window', function($scope, $http, SessionService, Restangular, $window) {
        $scope.session = SessionService.getSession();
        Restangular.one('getuserid',$scope.session).get()
        .then(function(data) {
            $scope.user = data;
        });

        $scope.$on('event:login-confirmed', function() {
            console.log('event has been broadcast to Home Controller');
            $scope.session = SessionService.getSession();
        });
        $scope.image = null;
        $scope.imageFileName = '';
        $scope.location = Object();
        $scope.gps = null;
        $scope.street = null;
        $scope.city = null;
        $scope.state = null;
        $scope.country = null;
        $scope.locationName = null;
        $scope.description = null;
        $scope.photos = null;
        $scope.comments = "none";
        $scope.sponsored = null;
        $scope.upVoteCount = 0;
        $scope.downVoteCount = 0;
        $scope.submitted = false;

        $scope.uploadFile = function (files) {
            $scope.location.photos = files[0];
            console.log($scope.location.photos);
        }
        $scope.save = function () {
            if ($scope.submitted == false) {
                var fd = new FormData();
                fd.append("locationName", $scope.locationName);
                fd.append("description", $scope.description);
                fd.append("gps", $scope.gps);
                fd.append("street", $scope.street);
                fd.append("city", $scope.city);
                fd.append("state", $scope.state);
                fd.append("country", $scope.country);
                fd.append("photos", $scope.location.photos);
                fd.append("comments", $scope.comments);
                fd.append("sponsored", $scope.sponsored);
                fd.append("user", $scope.user);
                fd.append("upVoteCount", $scope.upVoteCount);
                fd.append("downVoteCount", $scope.downVoteCount);

                $http.post('http://localhost:8001/location', fd, {
//                   withCredentials: true,
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).success(function (response) {
                        $window.location = 'index.html#/home';
                    }).error(function (response) {
                        console.log('Response: ' + response);
                    });
            }
        }

    }])
    .controller('HomeController', ['$scope', 'SessionService', 'Restangular', function ($scope, SessionService, Restangular) {
        $scope.session = SessionService.getSession();

        $scope.user = {};

        $scope.$on('event:login-confirmed', function() {
            console.log('event has been broadcast to Home Controller');
            $scope.session = SessionService.getSession();
        });
        var s = $(".filterbox");
        var pos = s.position();
        $(window).scroll(function() {
            var windowpos = $(window).scrollTop();
            if (windowpos >= pos.top-40) {
                s.addClass("stick");
            } else {
                s.removeClass("stick");
            }
        });
        // for the filters / sorting functionality
        $scope.predicate = '-upVoteCount';
        $scope.predicate = '-datecreated';

        // allows images to show up on the homepage
        $scope.imagefinder = function() {
            for (var i = 0; i < $scope.locationList.length; i++) {
                Restangular.one('uploadedimages', i+1).customGET()
                    .then(function (photo_url) {
                        $scope.locationList[photo_url[1]-1].photo_url = photo_url[0];
                    })
            }
        }

        $scope.locationList = {};
        Restangular.all('location').getList()
            .then(function (data) {
                $scope.locationList = data;
                $scope.imagefinder();
            })

        // Saves the Up Votes and down Votes back to the server
        var vote = false;

        $scope.countChoculaUp = function(location){
            if (location.voted==null){
                location.upVoteCount += 1;
                location.voted = true;
                delete location.photos;
                Restangular.one('location-detail', location.id).customPUT(location)
                .then(function (data) {
                  console.log(data);
                })
            }
        };
        $scope.countChoculaDown = function(location){
            if (location.voted==null){
                location.downVoteCount -= 1;
                location.voted = true;
                delete location.photos;
                Restangular.one('location-detail', location.id).customPUT(location)
                .then(function (data) {
                  console.log(data);
                })
            }
        };

        $scope.userList = {};
        Restangular.all('users').getList()
            .then(function (data) {
                $scope.userList = data;
            })
    }])
    .controller('AccountProfileController', ['$scope', 'SessionService', 'Restangular', function($scope, SessionService, Restangular) {
        $scope.session = SessionService.getSession();
        $scope.currentUserInfo = SessionService.getUserSession();

        $scope.user = {};

        $scope.$on('event:login-confirmed', function() {
            console.log('event has been broadcast to Home Controller');
            $scope.session = SessionService.getSession();
        });

        $scope.userList = {};
        Restangular.all('users').getList()
            .then(function(data) {
                $scope.userList = data;
                console.log("Success! you got data");
                console.log($scope.userList);
            })

    }])

    .controller('addRecipeCtrl', function ($scope, $http, Recipe, $routeParams, Restangular, $window) {

        $scope.recipe = Object();
        $scope.recipeList = null;
        $scope.tag = null;
        $scope.name = null;
        $scope.submitted = false;

        Restangular.all('tags').getList().then(function (response) {
            $scope.tags = response;
        });


        Restangular.all('recipelists').getList().then(function (response) {
            $scope.recipeLists = response;
        });


        $scope.uploadFile = function (files) {
            $scope.recipe.photo = files[0];
            alert(files[0])
        }

        $scope.save = function () {
            if ($scope.submitted == false) {
                $scope.recipe.recipe_name = $scope.name;

//                alert($scope.photo);
                $scope.recipe.recipe_description = $scope.description;
                $scope.recipe.recipe_prep_time = $scope.prep;
                $scope.recipe.recipe_cook_time = $scope.cook;
                $scope.recipe.recipe_total_time = $scope.total;
                $scope.recipe.tag = $scope.tag;
                $scope.recipe.recipe_list = $scope.recipeList;
                $scope.recipe.user = 1;
//                Restangular.one('recipes').customPOST($scope.recipe).then(function (data) {
//                    $scope.submitted = true;
//                });

                var fd = new FormData();
                //Take the first selected file
                fd.append("recipe_name", $scope.recipe.recipe_name);
                fd.append("user", 1);
                fd.append("tag", $scope.recipe.tag);
                fd.append("recipe_lists", $scope.recipe.recipe_list);
                fd.append("photo", $scope.recipe.photo);
//                alert($scope.recipe.recipe_list);

                $http.post('http://localhost:8001/recipes', fd, {
//                    withCredentials: true,
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).success(function (response) {
//                        alert('Success response: ' + response);
                        $window.location = '/app/index.html';
//                        /recipes/:recipeID
                    }).error(function (response) {
//                        alert('Response: ' + response);
                    })


            }
        }

        $scope.addTag = function () {
            $scope.newTag = Object();
            $scope.newTag.tag_name = $scope.newTagName;


            Restangular.one('tags').customPOST($scope.newTag).then(function (response) {
                $scope.tags.push(response);
            })
        };


        $scope.addList = function () {
            $scope.newList = Object();
            $scope.newList.recipe_list_name = $scope.newListName;


            Restangular.one('recipelists').customPOST($scope.newList).then(function (response) {
                $scope.recipeLists.push(response);
            })
        }
    })

    .controller('LocationDetailsController', ['$scope', '$http', 'SessionService', 'Restangular', '$routeParams', function ($scope, $http, SessionService, Restangular, $routeParams) {
        $scope.session = SessionService.getSession();
        $scope.id = $routeParams.id-1;

        Restangular.one('uploadedimages', $routeParams.id).customGET()
            .then(function (photo_url) {
                $scope.photo_url = photo_url[0];
        })


        Restangular.all('location').getList()
            .then(function (locationList) {
                $scope.location = locationList[$scope.id];
            });
//
//        SessionService.success(function(data) {
//            $scope.locationList = data;
//            $scope.location = $scope.locationList[$scope.id];
//            })
        $scope.comment = Object();
        $scope.locationPostID = $scope.id;
        $scope.commentText = null;
        $scope.submitted = false;
        $scope.user = 1;

//        console.log('USER: ' + JSON.stringify($scope.session));

        $scope.save = function () {
            if ($scope.submitted == false) {
                $scope.comment.locationPostID = $scope.locationPostID;
                $scope.comment.commentText = $scope.commentText;
                $scope.comment.user = $scope.user;

                var fd = {};
                fd["locationPostID"] = $scope.comment.locationPostID+1;
                fd["commentText"] = $scope.comment.commentText;
                fd["user"] = $scope.comment.user;

                $http({
                    method: 'POST',
                    url: 'http://localhost:8001/comment',
                    data: fd
                }).success(function (response) {
                        $scope.commentList[$scope.commentList.length] = response;
                        $scope.submitted = true;
                    }).error(function (response) {
                        console.log("there was an Error! Run!!" + response);
                    });
            }
        };

        $scope.commentList = {};
        Restangular.all('comment').getList()
            .then(function (data) {
                $scope.commentList = data;
                console.log("Success! you got data");
                console.log($scope.commentList);
            })
        $scope.userList = {};
        Restangular.all('users').getList()
            .then(function (data) {
                $scope.userList = data;
            })
    }]);


