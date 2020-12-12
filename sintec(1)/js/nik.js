
var myapp = angular.module("myApp",[]);

myapp.controller("homeCtrl",function($scope,$http)
{
$scope.send_sms = 0;
$scope.send_sms_mem = 0;

$scope.submitForm = function()
{
	$http({
		method : 'post',
		url : 'php/contact.php',
		data : {'message' : $scope.message , 'ref' : 1, 'name' : $scope.name,
		'mobile' : $scope.mobile, 'email' : $scope.email}
	}).then(function (response)
	{
		$scope.respond = response.data;
		
		if($scope.respond==1)
		{
			document.getElementById("success").style.display="block";
			document.getElementById("success").style.opacity="1";
			setTimeout(function()
			{
				document.getElementById("success").style.display="none";
				document.getElementById("success").style.opacity="0";
			},2000);
		}
		else
		{
			document.getElementById("error").style.display="block";
			document.getElementById("error").style.opacity="1";
			setTimeout(function()
			{
				document.getElementById("error").style.display="none";
				document.getElementById("error").style.opacity="0";
			},2000);
		}
	});
}

$scope.open_login = function()
{
	var x = document.getElementById("nik-admem").style.display;
	
	if(x.localeCompare("block"))
	{
		document.getElementById("nik-admem").style.display = "block";
	}
	else
	{
		document.getElementById("nik-admem").style.display = "none";
	}
}

$scope.init = function()
{
	if(localStorage.getItem("mobile"))
	{
		if(localStorage.getItem("userType")==1)
		{
			window.open("../dashboard/ltr/index.html","_self");
		}
		else if(localStorage.getItem("userType")==2)
		{
			window.open("../dashboard/ltr/user-profile.html","_self");
		}
	}
	else
	{
		if(sessionStorage.loginState)
		{
			document.getElementById("mob_num_head_admin").style.display = "none";
			document.getElementById("name_head_admin").style.display = "none";
			document.getElementById("otp_head_admin").style.display = "block";
		}	
		if(sessionStorage.loginStateMem)
		{
			document.getElementById("mob_num_head_member").style.display = "none";
			document.getElementById("name_head_member").style.display = "none";
			document.getElementById("otp_head_member").style.display = "block";
		}	
	}
}

$scope.accept_details_admin = function()
{
	//alert("Hello");
	//console.log("Hi");
	document.getElementsByTagName("BODY")[0].style.overflow="hidden";
	document.getElementById("login_head_admin").style.height = "100%";
	document.getElementById("login_sub_admin").style.animationName="loginModal";
}

$scope.close_login_admin = function()
{
	document.getElementsByTagName("BODY")[0].style.overflow="scroll";
	document.getElementById("login_head_admin").style.height = "0px";
	document.getElementById("login_sub_admin").style.animationName="none";
}

$scope.clear_login_note_admin = function()
{
	document.getElementById("login_note_admin").style.display = "none";
}

$scope.login_submit_admin = function()
{
	$scope.mob_num = document.getElementById("mob_num_admin").value;
	
	if(!sessionStorage.loginState)
	{
		if($scope.mob_num.length<10 || $scope.mob_num.length>10)
		{
			document.getElementById("login_note_admin").style.display = "block";
		}
		else
		{
			if(!$scope.send_sms)
			{
			$scope.send_sms = 1;
			
			sessionStorage.setItem("mobile",$scope.mob_num);
			
			$http({
				method : 'post',
				url : 'php/smssender.php',
				data : {'number' : $scope.mob_num , 'ref' : 1, 'name' : $scope.name}
			}).then(function (response)
			{
				$scope.respond = response.data;
				console.log($scope.respond);
				
				if($scope.respond)
				{
					$scope.send_sms = 1;
				}
				else
				{
					$scope.send_sms = 0;
				}
				
				sessionStorage.setItem("loginState",1);
				document.getElementById("mob_num_head_admin").style.display = "none";
				document.getElementById("name_head_admin").style.display = "none";
				document.getElementById("otp_head_admin").style.display = "block";
			});
			}
		}
		
		console.log("1");
	}
	else
	{
		console.log("2");
		
		var otp = document.getElementById("otp").value;
		
		$http({
				method : 'post',
				url : 'php/smssender.php',
				data : {'number' : $scope.mob_num , 'ref' : 2, 'otp' : otp}
			}).then(function (response)
			{
				$scope.custData = response.data;
				console.log($scope.custData);
				
				sessionStorage.setItem("custData",JSON.stringify($scope.custData));
				
				if($scope.custData.flag)
				{
					localStorage.setItem("mobile",sessionStorage.mobile);
					localStorage.setItem("userType",1);
					//document.getElementById("Login_b").style.display = "none";
					//document.getElementById("Login_list").style.display = "block";
					$scope.close_login_admin();
					window.open("../dashboard/ltr/index.html","_self");
				}
				else
				{
					document.getElementById("otp_note_admin").style.display = "block";
				}
			});
	}
}

$scope.clear_otp_note_admin = function()
{
	document.getElementById("otp_note_admin").style.display = "none";
}

$scope.clear_otp_note_member = function()
{
	document.getElementById("otp_note_member").style.display = "none";
}

$scope.accept_details_member = function()
{
	//alert("Hello");
	//console.log("Hi");
	document.getElementsByTagName("BODY")[0].style.overflow="hidden";
	document.getElementById("login_head_member").style.height = "100%";
	document.getElementById("login_sub_member").style.animationName="loginModal";
}

$scope.close_login_member = function()
{
	document.getElementsByTagName("BODY")[0].style.overflow="scroll";
	document.getElementById("login_head_member").style.height = "0px";
	document.getElementById("login_sub_member").style.animationName="none";
}

$scope.clear_login_note_member = function()
{
	document.getElementById("login_note_member").style.display = "none";
	document.getElementById("admin_note_member").style.display = "none";
}

$scope.login_submit_member = function()
{
	$scope.mob_num = document.getElementById("mob_num_member").value;
	console.log($scope.mob_num);
	
	if(!sessionStorage.loginStateMem)
	{
		if($scope.mob_num.length<10 || $scope.mob_num.length>10)
		{
			document.getElementById("login_note_member").style.display = "block";
		}
		else
		{
			if(!$scope.send_sms_mem)
			{
			$scope.send_sms_mem = 1;
			
			sessionStorage.setItem("mobile",$scope.mob_num);
			
			$http({
				method : 'post',
				url : 'php/smssender.php',
				data : {'number' : $scope.mob_num , 'ref' : 3, 'name' : $scope.member_name}
			}).then(function (response)
			{
				$scope.respond = response.data;
				console.log($scope.respond);
				
				if($scope.respond==1)
				{
					$scope.send_sms = 1;
				}
				else
				{
					$scope.send_sms = 0;
				}
				
				if($scope.respond==2)
				{
					document.getElementById("admin_note_member").style.display = "block";
				}
				else
				{
					sessionStorage.setItem("loginStateMem",1);
					document.getElementById("mob_num_head_member").style.display = "none";
					document.getElementById("name_head_member").style.display = "none";
					document.getElementById("otp_head_member").style.display = "block";
				}
			});
			}
		}
		
		console.log("1");
	}
	else
	{
		console.log("2");
		
		var otp = document.getElementById("otp_member").value;
		
		console.log(otp);
		console.log($scope.mob_num);
		
		$http({
				method : 'post',
				url : 'php/smssender.php',
				data : {'number' : $scope.mob_num , 'ref' : 4, 'otp' : otp}
			}).then(function (response)
			{
				$scope.memberData = response.data;
				console.log($scope.memberData);
				
				sessionStorage.setItem("memberData",JSON.stringify($scope.memberData));
				
				if($scope.memberData.flag)
				{
					localStorage.setItem("mobile",sessionStorage.mobile);
					localStorage.setItem("userType",2);
					//document.getElementById("Login_b").style.display = "none";
					//document.getElementById("Login_list").style.display = "block";
					$scope.close_login_member();
					window.open("../dashboard/ltr/user-profile.html","_self");
				}
				else
				{
					document.getElementById("otp_note_member").style.display = "block";
				}
			});
	}
}



});