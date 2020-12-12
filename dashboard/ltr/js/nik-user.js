var checkResponse = 0;

function logout()
{
	localStorage.removeItem("userType");
	localStorage.removeItem("mobile");
	sessionStorage.removeItem("loginStateMem");
	sessionStorage.removeItem("loginState");
	window.open("../../sintec(1)/index.html","_self");
}

function check_complain()
{
			if("0".localeCompare(checkResponse))
			 {
				document.getElementById("success").style.display = "block";
				setTimeout(function hide()
				{
					document.getElementById("success").style.display = "none";
				}
				,"2000");
				window.open("user-complain.html","_self");
			 }
			 else
			 {
				document.getElementById("failed").style.display = "block";
				setTimeout(function hide()
				{
					document.getElementById("failed").style.display = "none";
				}
				,"2000");
			 }
}

function check_msg()
{
			if("0".localeCompare(checkResponse))
			 {
				document.getElementById("success").style.display = "block";
				setTimeout(function hide()
				{
					document.getElementById("success").style.display = "none";
				}
				,"2000");
				window.open("user-quora.html","_self");
			 }
			 else
			 {
				document.getElementById("failed").style.display = "block";
				setTimeout(function hide()
				{
					document.getElementById("failed").style.display = "none";
				}
				,"2000");
			 }
}

var myapp = angular.module("myApp",[]);

myapp.controller("profileCtrl",function($scope,$http)
{			
	$scope.init = function()
	{
		$scope.userType = localStorage.getItem("userType");

		console.log($scope.userType);
		
		if($scope.userType==2)
		{
			$scope.mob_num = localStorage.getItem("mobile");
				
			console.log($scope.mob_num);
		
			$http({
				method : 'post',
				url : 'php/user-profile.php',
				data : {'mob_num' : $scope.mob_num}
			}).then(function(response)
			{
				memberId = response.data.memberId;
				sessionStorage.setItem("memberId",memberId);
				$scope.m_details = response.data.m_details;
				sessionStorage.setItem("memdetails",JSON.stringify($scope.m_details));
	
				$scope.memName = $scope.m_details[0]['name'];
				
				$scope.vehicle = response.data.vehicle;
			});
		}
		else
		{
			window.open("../../sintec(1)/index.html","_self");
		}
	}
});

myapp.controller("faqCtrl",function($scope,$http)
{
	var memberId = sessionStorage.getItem("memberId");
	
	$scope.m_details = JSON.parse(sessionStorage.getItem("memdetails"));
	$scope.memName = $scope.m_details[0]['name'];
	
	$scope.init = function()
	{
		$http({
			method : 'post',
			url : 'php/user-faq.php',
			data : {'memberId' : memberId}
		}).then(function(response)
		{
			$scope.faq = response.data.faq;
		});
	}
});

myapp.controller("complainCtrl",function($scope,$http)
{
	var memberId = sessionStorage.getItem("memberId");
	
	$scope.m_details = JSON.parse(sessionStorage.getItem("memdetails"));
	$scope.memName = $scope.m_details[0]['name'];
	
	$scope.init = function()
	{
		
		$http({
			method : 'post',
			url : 'php/user-complain.php',
			data : {'memberId' : memberId , 'ref' : 1}
		}).then(function(response)
		{
			$scope.complain = response.data.c_details;
		});
	}
	
	$scope.deleteCom = function(complainId)
	{
		$http({
			method : 'post',
			url : 'php/user-complain.php',
			data : {'memberId' : memberId , 'ref' : 2, 'complainId' : complainId}
		}).then(function(response)
		{
			checkResponse = response.data;
			check_complain();
		});
	}
	
	$scope.complainFunc = function()
	{
		$http({
			method : 'post',
			url : 'php/user-complain.php',
			data : {'memberId' : memberId , 'ref' : 3, 'complainTxt' : $scope.complainTxt}
		}).then(function(response)
		{
			checkResponse = response.data;
			check_complain();
		});
	}
});

myapp.controller("accountsCtrl",function($scope,$http)
{
	var memberId = sessionStorage.getItem("memberId");
	
	$scope.m_details = JSON.parse(sessionStorage.getItem("memdetails"));
	$scope.memName = $scope.m_details[0]['name'];
	
	$scope.open_menu = function(x)
	{
			switch(x)
			{
				case 1: window.open("user-rent.html","_self");
						break;
				case 2: window.open("user-light.html","_self");
						break;
				case 3: window.open("user-fine.html","_self");
						break;
				case 4: window.open("user-events.html","_self");
						break;
			}
	}
	
	$scope.event_init = function()
	{
			$http({
				method : 'post',
				url : 'php/user-accounts.php',
				data : {'memberId' : memberId , 'ref' : 1}
			}).then(function(response)
			{
				$scope.events = response.data.events;
			});
	}
	
	$scope.fine_init = function()
	{
			$http({
				method : 'post',
				url : 'php/user-accounts.php',
				data : {'memberId' : memberId , 'ref' : 2}
			}).then(function(response)
			{
				$scope.fine = response.data.fine;
			});
	}

	$scope.light_init = function()
	{
			$http({
				method : 'post',
				url : 'php/user-accounts.php',
				data : {'memberId' : memberId, 'ref' : 6}
			}).then(function(response)
			{
				$scope.bill_details = response.data.bill_details;
				$scope.member = response.data.member;
				
				console.log($scope.bill_details);
				console.log($scope.member);
			});
			
			$http({
				method : 'post',
				url : 'php/user-accounts.php',
				data : {'memberId' : memberId, 'ref' : 7}
			}).then(function(response)
			{
				$scope.pending_details = response.data.bill_details;
				console.log($scope.pending_details);
			});
		
	}

	$scope.pending_light = function()
	{
		document.getElementById("pending_light").style.display = "block";
		document.getElementById("history_light").style.display = "none";
	}
	
	$scope.history_light = function()
	{
		document.getElementById("history_light").style.display = "block";
		document.getElementById("pending_light").style.display = "none";
	}
	
	
	$scope.rent_init = function()
	{
		$http({
				method : 'post',
				url : 'php/user-accounts.php',
				data : {'memberId' : memberId, 'ref' : 4}
			}).then(function(response)
			{
				$scope.rent_details = response.data.rent_details;
				$scope.member_rent = response.data.member_rent;
				
				console.log($scope.rent_details);
				console.log($scope.member_rent);
			});
			
		
		$http({
				method : 'post',
				url : 'php/user-accounts.php',
				data : {'memberId' : memberId, 'ref' : 5}
			}).then(function(response)
			{
				$scope.pending_details = response.data.pending_details;
				console.log($scope.pending_details);
			});
	}
	
	$scope.pending_rent = function()
	{
		document.getElementById("pending_rent").style.display = "block";
		document.getElementById("history_rent").style.display = "none";
	}
	
	$scope.history_rent = function()
	{
		document.getElementById("history_rent").style.display = "block";
		document.getElementById("pending_rent").style.display = "none";
	}
	
});

myapp.controller("quoraCtrl",function($scope,$http)
{
	var memberId = sessionStorage.getItem("memberId");
	
	$scope.memId = memberId;
	
	$scope.m_details = JSON.parse(sessionStorage.getItem("memdetails"));
	$scope.memName = $scope.m_details[0]['name'];
	
	$scope.init = function()
	{	
		$http({
			method : 'post',
			url : 'php/user-quora.php',
			data : {'memberId' : memberId, 'ref' : 1}
		}).then(function(response)
		{
			$scope.message = response.data.message;
			console.log($scope.message);
		});
	}
	
	$scope.send_msg = function()
	{
		$http({
			method : 'post',
			url : 'php/user-quora.php',
			data : {'memberId' : memberId, 'ref' : 2, 'msg' : $scope.msg}
		}).then(function(response)
		{
			checkResponse = response.data;
			check_msg();
		});
	}
	
});


myapp.controller("messageCtrl",function($scope,$http)
{
	var memberId = sessionStorage.getItem("memberId");
	
	$scope.memId = memberId;
	
	$scope.m_details = JSON.parse(sessionStorage.getItem("memdetails"));
	$scope.memName = $scope.m_details[0]['name'];
	
	$scope.init = function()
	{	
		$http({
			method : 'post',
			url : 'php/user-message.php',
			data : {'memberId' : memberId}
		}).then(function(response)
		{
			$scope.message = response.data.message;
			console.log($scope.message);
		});
	}

});



myapp.directive('onFinishRender', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			if (scope.$last === true) {
				$timeout(function () {
					scope.$emit('ngRepeatFinished');
				});
			}
		}
	}
});
