var checkResponse = "";

function logout()
{
	localStorage.removeItem("userType");
	localStorage.removeItem("mobile");
	sessionStorage.removeItem("loginStateMem");
	sessionStorage.removeItem("loginState");
	window.open("../../sintec(1)/index.html","_self");
}

var myapp = angular.module("myApp",[]);

myapp.directive('fileModel', ['$parse', function ($parse) {
    return {
    restrict: 'A',
    link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
            scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
            });
        });
    }
   };
}]);

myapp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl, name, address, adminId, buildId){
         var fd = new FormData();
         fd.append('file', file);
         fd.append('name', name);
		 fd.append('address', address);
		 fd.append('adminId', adminId);
		 fd.append('buildId', buildId);
         $http.post(uploadUrl, fd, {
             transformRequest: angular.identity,
             headers: {'Content-Type': undefined,'Process-Data': false}
         })
         .then(function(response)
		 {
			checkResponse = response.data;
			check_status();
		 });
     }
	 
	 this.uploadDocToUrl = function(file, uploadUrl, name, b_selected, ref){
         var fd = new FormData();
         fd.append('file', file);
         fd.append('name', name);
		 fd.append('ref', ref);
		 fd.append('b_selected', b_selected);

         $http.post(uploadUrl, fd, {
             transformRequest: angular.identity,
             headers: {'Content-Type': undefined,'Process-Data': false}
         })
         .then(function(response)
		 {
			checkResponse = response.data;
			check_status();
		 });
     }
 }]);

function check_book_status(chkResponse)
{
			if("0".localeCompare(chkResponse))
			 {
				document.getElementById("success").style.display = "block";
				setTimeout(function hide()
				{
					document.getElementById("success").style.display = "none";
				}
				,"2000");
				
				setTimeout(function hide()
				{
					window.open("events.html","_self");
				}
				,"1000");
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
 
function check_msg_status(chkResponse)
{
			if("0".localeCompare(chkResponse))
			 {
				document.getElementById("success").style.display = "block";
				setTimeout(function hide()
				{
					document.getElementById("success").style.display = "none";
				}
				,"2000");
				
				setTimeout(function hide()
				{
					window.open("message.html","_self");
				}
				,"1000");
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
 
function check_status()
{
			if("0".localeCompare(checkResponse))
			 {
				document.getElementById("success").style.display = "block";
				setTimeout(function hide()
				{
					document.getElementById("success").style.display = "none";
				}
				,"2000");
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

myapp.controller("bCtrl",['$scope', 'fileUpload', function($scope, fileUpload)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' );
        console.dir(file);

		var flag = parseInt(sessionStorage.getItem("flag"));
		
        var uploadUrl = "php/building_details.php";
        var name = $scope.name;
		var address = $scope.address;
		var adminId = sessionStorage.getItem("nikAdminId");
		var buildId;
		
		if(flag)
		{
			buildId = sessionStorage.getItem("b_selected");
		}
		
        fileUpload.uploadFileToUrl(file, uploadUrl, name, address, adminId, buildId);
   };
	
}]);

myapp.controller("socCtrl",['$scope', 'fileUpload', function($scope, fileUpload)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.uploadDoc = function(){
        var file = $scope.myFile;
        console.log('file is ' );
        console.dir(file);

        var uploadUrl = "php/society_docs.php";
        var name = $scope.doc_name;
		var ref = 13;
		
        fileUpload.uploadDocToUrl(file, uploadUrl, name, $scope.b_selected, ref);
   };
	
}]);
 
myapp.controller("buildingCtrl",function($scope,$http)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	$scope.flag;
	$scope.but_show = false;
	
	$scope.update_profile = function()
	{
		$scope.adminId = sessionStorage.getItem("nikAdminId");
		
		$http({
			method : 'post',
			url : 'php/index_update.php',
			data : { 'adminId' : $scope.adminId , 'admin_details' : $scope.admin_details}
		}).then(function(response)
		{
			if("0".localeCompare(response.data))
			 {
				document.getElementById("success").style.display = "block";
				setTimeout(function hide()
				{
					document.getElementById("success").style.display = "none";
				}
				,"2000");
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
		});
	}
	
	$scope.building_delete = function(b_selected,pageNo)
	{
		var x = confirm("Are you sure you want to delete?");
			
			if(x)
			{
				$http({
				method : 'post',
				url : 'php/delete.php',
				data : {'b_selected' : b_selected , 'ref' : pageNo}
				}).then(function(response)
				{
					if(!"0".localeCompare(checkResponse))
					{
						document.getElementById("failed").style.display = "block";
						setTimeout(function hide()
						{
							document.getElementById("failed").style.display = "none";
						}
						,"2000");
					}
					else
					{
						window.open("index.html","_self");
						sessionStorage.setItem("b_selected",-1);
					}
				});
			}
	}
	
	$scope.member_delete = function(pageNo)
	{
		$scope.memberId = sessionStorage.getItem("memberId");
		
		var x = confirm("Are you sure you want to delete?");
			
			if(x)
			{
				$http({
				method : 'post',
				url : 'php/delete.php',
				data : {'memberId' : $scope.memberId , 'ref' : pageNo}
				}).then(function(response)
				{
					if(!"0".localeCompare(checkResponse))
					{
						document.getElementById("failed").style.display = "block";
						setTimeout(function hide()
						{
							document.getElementById("failed").style.display = "none";
						}
						,"2000");
					}
					else
					{
						window.open("members.html","_self");
						sessionStorage.setItem("memberId",-1);
					}
				});
			}
	}
	
	$scope.management_delete = function(pageNo)
	{
		$scope.memberId = sessionStorage.getItem("memberId");
		
		var x = confirm("Are you sure you want to delete?");
			
			if(x)
			{
				$http({
				method : 'post',
				url : 'php/delete.php',
				data : {'memberId' : $scope.memberId , 'ref' : pageNo}
				}).then(function(response)
				{
					if(!"0".localeCompare(checkResponse))
					{
						document.getElementById("failed").style.display = "block";
						setTimeout(function hide()
						{
							document.getElementById("failed").style.display = "none";
						}
						,"2000");
					}
					else
					{
						window.open("management.html","_self");
						sessionStorage.setItem("memberId",-1);
					}
				});
			}
	}
	
	$scope.room_delete = function(pageNo)
	{
		$scope.roomId = sessionStorage.getItem("roomId");
		
		var x = confirm("Are you sure you want to delete?");
			
			if(x)
			{
				$http({
				method : 'post',
				url : 'php/delete.php',
				data : {'roomId' : $scope.roomId , 'ref' : pageNo}
				}).then(function(response)
				{
					if(!"0".localeCompare(checkResponse))
					{
						document.getElementById("failed").style.display = "block";
						setTimeout(function hide()
						{
							document.getElementById("failed").style.display = "none";
						}
						,"2000");
					}
					else
					{
						window.open("room_details.html","_self");
						sessionStorage.setItem("roomId",-1);
					}
				});
			}
	}
	
	$scope.vehicle_delete = function(pageNo)
	{
		$scope.vehicleId = sessionStorage.getItem("vehicleId");
		
		var x = confirm("Are you sure you want to delete?");
			
			if(x)
			{
				$http({
				method : 'post',
				url : 'php/delete.php',
				data : {'vehicleId' : $scope.vehicleId , 'ref' : pageNo}
				}).then(function(response)
				{
					if(!"0".localeCompare(checkResponse))
					{
						document.getElementById("failed").style.display = "block";
						setTimeout(function hide()
						{
							document.getElementById("failed").style.display = "none";
						}
						,"2000");
					}
					else
					{
						window.open("vehicles.html","_self");
						sessionStorage.setItem("vehicleId",-1);
					}
				});
			}
	}
	
	$scope.serviceman_delete = function(pageNo)
	{
		$scope.memberId = sessionStorage.getItem("memberId");
		
		var x = confirm("Are you sure you want to delete?");
			
			if(x)
			{
				$http({
				method : 'post',
				url : 'php/delete.php',
				data : {'memberId' : $scope.memberId , 'ref' : pageNo}
				}).then(function(response)
				{
					if(!"0".localeCompare(checkResponse))
					{
						document.getElementById("failed").style.display = "block";
						setTimeout(function hide()
						{
							document.getElementById("failed").style.display = "none";
						}
						,"2000");
					}
					else
					{
						window.open("serviceman.html","_self");
						sessionStorage.setItem("memberId",-1);
					}
				});
			}
	}
	
	$scope.button_clicked = function(flag, pageNo)
	{
		var b_selected = sessionStorage.getItem("b_selected");
		
		if((flag==1 && b_selected!=-1) || flag==0)
		{
		sessionStorage.setItem("flag",flag);
		switch(pageNo)
		{
			case 1:	window.open("building_details.html","_self");
					break;
			case 2:	if(b_selected!=-1)
					{
						window.open("members_details.html","_self");
					}
					else
					{
						document.getElementById("nik-required2").style.display = "block";
					}
					break;
			case 3:	if(b_selected!=-1)
					{
						window.open("management_details.html","_self");
					}
					else
					{
						document.getElementById("nik-required2").style.display = "block";
					}
					break;
			case 4:	window.open("events_booking.html","_self");
					break;
			case 5:	if(b_selected!=-1)
					{
						window.open("serviceman_detail.html","_self");
					}
					else
					{
						document.getElementById("nik-required2").style.display = "block";
					}
					break;
			case 6:	if(b_selected!=-1)
					{
						window.open("vehicles_detail.html","_self");
					}
					else
					{
						document.getElementById("nik-required2").style.display = "block";
					}
					break;
			case 7:	if(b_selected!=-1)
					{
						window.open("room_details_in.html","_self");
					}
					else
					{
						document.getElementById("nik-required2").style.display = "block";
					}
					break;
		}
		}
		else if(flag==2 && b_selected!=-1)
		{
			switch(pageNo)
			{
				case 1:	$scope.building_delete(b_selected,pageNo);
						break;
				
				case 2:	$scope.member_delete(pageNo);
						break;
						
				case 3: $scope.management_delete(pageNo);
						break;
						
				case 5: $scope.serviceman_delete(pageNo);
						break;
						
				case 6: $scope.vehicle_delete(pageNo);
						break;
						
				case 7: $scope.room_delete(pageNo);
						break;
			}
		}
		else
		{
			document.getElementById("nik-required").style.display = "block";
		}
		
	}
	
	$scope.index_init = function()
	{
		$scope.userType = localStorage.getItem("userType");

		console.log($scope.userType);
		
		if($scope.userType==1)
		{
			$scope.mob_num = localStorage.getItem("mobile");
				
			console.log($scope.mob_num);
		
			$scope.admin_details = {'address':'','contact':'','dob':'','email':'','id':'','name':'','password':'','username':''};
			
			$scope.b_selected = sessionStorage.getItem("b_selected");
			
			$http({
				method : 'post',
				url : 'php/index.php',
				data : { 'mob_num' : $scope.mob_num }
			}).then(function(response)
			{
				$scope.b_details = response.data.b_details;
				$scope.admin_details = response.data.admin_details;
				sessionStorage.setItem("nikAdminId",$scope.admin_details['id']);
				sessionStorage.setItem("adminName",$scope.admin_details['name']);
				
				$scope.adminName = sessionStorage.getItem("adminName");
				
				console.log($scope.admin_details);
				console.log($scope.b_details);
				if($scope.b_details)
				{
					$scope.but_show = true;
				}
				
				sessionStorage.setItem("b_details",JSON.stringify($scope.b_details));
			});
		
		}
		else
		{
			window.open("../../sintec(1)/index.html","_self");
		}
	}
	
	$scope.b_details_init = function()
	{	
		$scope.flag = parseInt(sessionStorage.getItem("flag"));
		
		if($scope.flag)
		{
			document.getElementById("add_but").style.display = "none";
			
			$scope.b_details = JSON.parse(sessionStorage.getItem("b_details"));
			$scope.b_selected = sessionStorage.getItem("b_selected");
		
			for(i=0;i<$scope.b_details.length;i++)
			{
				if($scope.b_details[i]['id']==$scope.b_selected)
				{
					$scope.name = $scope.b_details[i]['name'];
					$scope.address = $scope.b_details[i]['address'];
				}
			}
		}
		else
		{
			document.getElementById("update_but").style.display = "none";
		}
	}
	
	$scope.bselect = function(id, bname)
	{
		document.getElementById("nik-required").style.display = "none";
		sessionStorage.setItem("b_selected",id);
		sessionStorage.setItem("bname",bname);
		
		document.getElementById("bselect"+id).style.display = "none";
		document.getElementById("bselected"+id).style.display = "block";
		
		for(i=0;i<$scope.b_details.length;i++)
		{
			if($scope.b_details[i]['id']!=id)
			{
				document.getElementById("bselect"+$scope.b_details[i]['id']).style.display = "block";
				document.getElementById("bselected"+$scope.b_details[i]['id']).style.display = "none";
			}
		}
	}
	
	$scope.bselected = function(id, bname)
	{
		sessionStorage.setItem("b_selected",-1);
		sessionStorage.setItem("bname","");
		
		document.getElementById("bselect"+id).style.display = "block";
		document.getElementById("bselected"+id).style.display = "none";
	}
	
});

myapp.controller("memberCtrl",function($scope,$http)
{	
	$scope.adminName = sessionStorage.getItem("adminName");

	$scope.options = ["All","Name","Room No"];
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.bname = "";
	if(sessionStorage.getItem("bname"))
	{
		$scope.bname = sessionStorage.getItem("bname");
	}
	
	if($scope.bname!="")
	{
		$scope.bname = $scope.bname + " : ";
	}
	
	$scope.count = 0;
	
	$scope.update_form = function()
	{
		var flag = sessionStorage.getItem("flag");
		
		if(!flag.localeCompare("1"))
		{
			$scope.memberId = sessionStorage.getItem("memberId");
		
			$http({
				method : 'post',
				url : 'php/members_profile.php',
				data : {'memberId' : $scope.memberId}
			}).then(function(response)
			{
				$scope.m_details = response.data.m_details;
				
				$scope.mname = $scope.m_details['name'];
				$scope.contact = parseInt($scope.m_details['contact']);
				$scope.email = $scope.m_details['email'];
				$scope.dob = $scope.m_details['dob'];
				$scope.roomNo = $scope.m_details['roomNo'];
				//$scope.address = $scope.m_details['perAddress'];
				$scope.tot_mem = $scope.m_details['totMembers'];
				$scope.doc = $scope.m_details['dateOfStay'];
				
				var address = $scope.m_details['perAddress'];
				var rent = $scope.m_details['rentAmt'];
				var deposit = $scope.m_details['depositAmt'];
				
				if(address)
				{
					document.getElementById("address_block").innerHTML = 
					'<label class="col-md-12">Address</label>'+
					'<div class="col-sm-12 col-md-6">'+
					'<textarea rows="3" id="address" required class="form-control form-control-line" required>'+
					address+'</textarea>'+
					'</div>'+
					'<label class="col-md-12">Rent</label>'+
					'<div class="col-sm-12 col-md-6">'+
					'<input type="number" value="'+rent+'" placeholder="" class="form-control form-control-line" required>'+
					'</div>'+
					'<label class="col-md-12">Deposit</label>'+
					'<div class="col-sm-12 col-md-6">'+
					'<input type="number" value="'+deposit+'" placeholder="" class="form-control form-control-line" required>'+
					'</div>';
				}
				
				if($scope.m_details['type'])
				{
					document.getElementById("tenant").checked = true;
				}
				else
				{
					document.getElementById("owner").checked = true;
				}
			});
		}
	}
	
	$scope.member_profile = function()
	{
		$scope.memberId = sessionStorage.getItem("memberId");
		
		$http({
				method : 'post',
				url : 'php/members_profile.php',
				data : {'memberId' : $scope.memberId}
			}).then(function(response)
			{
				$scope.m_details = response.data.m_details;
			});
	}
	
	$scope.show_profile = function(memberId)
	{
		sessionStorage.setItem("memberId",memberId);
		window.open("members_profile.html","_self");
	}
	
	$scope.submit_data = function()
	{
		var flag = sessionStorage.getItem("flag");
		
		if(!"1".localeCompare($scope.mtype))
		{
			var address = document.getElementById("address").value;
			var rent = document.getElementById("rent").value;
			var deposit = document.getElementById("deposit").value;
		}
		
		if(flag)
		{
			$scope.memberId = sessionStorage.getItem("memberId");
			
			$http({
				method : 'post',
				url : 'php/members_details.php',
				data : {'b_selected': $scope.b_selected, 'mname': $scope.mname, 'contact': $scope.contact, 'email': $scope.email,
				'dob': $scope.dob, 'roomNo': $scope.roomNo, 'address': address, 
				'tot_mem': $scope.tot_mem, 'doc': $scope.doc, 'mtype': $scope.mtype, 'flag': flag,
				'memberId': $scope.memberId, 'rent' : rent, 'deposit' : deposit}
			}).then(function(response)
			{
				checkResponse = response.data;
				check_status();
			});
		}
		else
		{
			$http({
				method : 'post',
				url : 'php/members_details.php',
				data : {'b_selected': $scope.b_selected, 'mname': $scope.mname, 'contact': $scope.contact, 'email': $scope.email,
				'dob': $scope.dob, 'roomNo': $scope.roomNo, 'address': address, 
				'tot_mem': $scope.tot_mem, 'doc': $scope.doc, 'mtype': $scope.mtype, 'flag': flag,
				'rent' : rent, 'deposit' : deposit}
			}).then(function(response)
			{
				checkResponse = response.data;
				check_status();
			});
		}
	}
	
	$scope.clear = function()
	{
		document.getElementById("nik-required").style.display = "none";
		$scope.countTest=1;
	}
	
	$scope.search_data = function()
	{
		if(!$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
			if(!"All".localeCompare($scope.search_slt))
			{
				$scope.collect_data();
			}
			else
			{
				if(!$scope.name)
				{
					$scope.message = "*Please enter search key";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					$scope.collect_data();
				}
			}
		}
	}
	
	$scope.collect_data = function()
	{
		$http({
			method : 'post',
			url : 'php/members.php',
			data : {'search_slt' : $scope.search_slt , 'name' : $scope.name , 'b_selected' : $scope.b_selected}
		}).then(function(response)
		{
			$scope.m_details = response.data.m_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
		});
	}
	
	$scope.show_address = function(x)
	{
		if(x)
		{
			document.getElementById("address_block").innerHTML = 
			'<label class="col-md-12">Address</label>'+
            '<div class="col-sm-12 col-md-6">'+
            '<textarea rows="3" id="address" required class="form-control form-control-line" required></textarea>'+
            '</div>'+
			'</div>'+
			'<label class="col-md-12" style="margin-top:10px">Rent</label>'+
			'<div class="col-sm-12 col-md-6">'+
			'<input type="number" id="rent" placeholder="" class="form-control form-control-line" required>'+
			'</div>'+
			'<label class="col-md-12" style="margin-top:10px">Deposit</label>'+
			'<div class="col-sm-12 col-md-6">'+
			'<input type="number" id="deposit" placeholder="" class="form-control form-control-line" required>'+
			'</div>';
		}
		else
		{
			document.getElementById("address_block").innerHTML = "";
			$scope.address = "";
		}
	}
});

myapp.controller("managementCtrl",function($scope,$http)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.b_member = false;
	$scope.options = ["All","Name","Role","Room No"];
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.bname = "";
	if(sessionStorage.getItem("bname"))
	{
		$scope.bname = sessionStorage.getItem("bname");
	}
	
	if($scope.bname!="")
	{
		$scope.bname = $scope.bname + " : ";
	}
	
	$scope.count = 0;
	
	
	$scope.member_profile = function()
	{
		$scope.memberId = sessionStorage.getItem("memberId");
		
		$http({
				method : 'post',
				url : 'php/management_profile.php',
				data : {'memberId' : $scope.memberId}
			}).then(function(response)
			{
				$scope.m_details = response.data.m_details;
			});
	}
	
	$scope.show_profile = function(memberId)
	{
		sessionStorage.setItem("memberId",memberId);
		window.open("management_profile.html","_self");
	}
	
	$scope.update_form = function()
	{
		var flag = sessionStorage.getItem("flag");
		
		if(!flag.localeCompare("1"))
		{
			$scope.memberId = sessionStorage.getItem("memberId");
		
			$http({
				method : 'post',
				url : 'php/management_profile.php',
				data : {'memberId' : $scope.memberId}
			}).then(function(response)
			{
				$scope.m_details = response.data.m_details;
				
				$scope.mname = $scope.m_details['name'];
				$scope.contact = parseInt($scope.m_details['contact']);
				$scope.email = $scope.m_details['email'];
				$scope.role = $scope.m_details['role'];
				
				var address = $scope.m_details['address'];
				var roomNo = $scope.m_details['roomNo'];
				var isMember = $scope.m_details['isMember'];
				
				if(isMember)
				{
					document.f1.b_member.checked = true;
					
					document.getElementById("block").innerHTML = 
					'<label class="col-md-12">Room No</label>'+
					'<div class="col-sm-12 col-md-6">'+
					'<input type="text" id="roomNo" placeholder="" value="'+
					roomNo
					+'" class="form-control form-control-line">'+
					'</div>';
				}
				else
				{
					document.f1.b_member.checked = false;
					
					document.getElementById("block").innerHTML = 
					'<label class="col-md-12">Address</label>'+
					'<div class="col-sm-12 col-md-6">'+
					'<textarea rows="3" id="address" class="form-control form-control-line">'+
					address+'</textarea>'+
					'</div>';
				}
			});
		}
	}
	
	$scope.submit_data = function()
	{
		var flag = sessionStorage.getItem("flag");
		
		if(!flag.localeCompare("1"))
		{
			$scope.memberId = sessionStorage.getItem("memberId");
			
			var x = document.f1.b_member.checked;
			var address = "";
			var roomNo = "";
			
			if(x)
			{
				var roomNo = document.getElementById("roomNo").value;
				var isMember = 1;
			}
			else
			{
				var address = document.getElementById("address").value;
				var isMember = 0;
			}
			
			$http({
				method : 'post',
				url : 'php/management_details.php',
				data : {'b_selected': $scope.b_selected, 'mname': $scope.mname, 'contact': $scope.contact, 'email': $scope.email,
				'role': $scope.role, 'flag': flag, 'memberId': $scope.memberId, 'roomNo': roomNo, 
				'address': address, 'isMember': isMember}
			}).then(function(response)
			{
				checkResponse = response.data;
				check_status();
			});
		}
		else
		{
			var x = document.f1.b_member.checked;
			
			if(x)
			{
				var roomNo = document.getElementById("roomNo").value;
				
				$http({
					method : 'post',
					url : 'php/management_details.php',
					data : {'b_selected': $scope.b_selected, 'mname': $scope.mname, 'contact': $scope.contact, 'email': $scope.email,
					'role': $scope.role, 'roomNo': roomNo, 'isMember': 1, 'flag': flag}
				}).then(function(response)
				{
					checkResponse = response.data;
					check_status();
				});
			}
			else
			{
				var address = document.getElementById("address").value;
				
				
				$http({
					method : 'post',
					url : 'php/management_details.php',
					data : {'b_selected': $scope.b_selected, 'mname': $scope.mname, 'contact': $scope.contact, 'email': $scope.email,
					'role': $scope.role, 'address': address, 'isMember': 0, 'flag': flag}
				}).then(function(response)
				{
					checkResponse = response.data;
					check_status();
				});
			}
		}
	}
	
	$scope.clear = function()
	{
		document.getElementById("nik-required").style.display = "none";
		$scope.countTest=1;
	}
	
	$scope.search_data = function()
	{
		if(!$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
			if(!"All".localeCompare($scope.search_slt))
			{
				$scope.collect_data();
			}
			else
			{
				if(!$scope.name)
				{
					$scope.message = "*Please enter search key";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					$scope.collect_data();
				}
			}
		}
	}
	
	$scope.collect_data = function()
	{
		$http({
			method : 'post',
			url : 'php/management.php',
			data : {'search_slt' : $scope.search_slt , 'name' : $scope.name , 'b_selected' : $scope.b_selected}
		}).then(function(response)
		{
			$scope.m_details = response.data.m_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
		});
	}
	
	$scope.show_address = function()
	{
		var x = document.f1.b_member.checked;
		
		if(x)
		{
			document.getElementById("block").innerHTML = 
			'<label class="col-md-12">Room No</label>'+
            '<div class="col-sm-12 col-md-6">'+
            '<input type="text" id="roomNo" placeholder="" class="form-control form-control-line">'+
            '</div>';
		}
		else
		{
			document.getElementById("block").innerHTML = 
			'<label class="col-md-12">Address</label>'+
            '<div class="col-sm-12 col-md-6">'+
            '<textarea rows="3" id="address" class="form-control form-control-line"></textarea>'+
            '</div>';
		}
	}
});

myapp.controller("eventCtrl",function($scope,$http)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.available = 2;
	
	$scope.bname = "";
	if(sessionStorage.getItem("bname"))
	{
		$scope.bname = sessionStorage.getItem("bname");
	}
	
	$scope.memberId = "";
	
	if($scope.bname!="")
	{
		$scope.bname = $scope.bname + " : ";
	}
	
	$scope.options = [];
	
	$scope.options2 = ["All","Name","Room No"];
	
	$scope.history_chk = function()
	{
		$http({
				method : 'post',
				url : 'php/event.php',
				data : {'b_selected': $scope.b_selected, 'hst_date' : $scope.hst_date, 'ref': 4}
			}).then(function(response)
			{
				$scope.past_events = response.data.past_events;
				
				if(!$scope.past_events)
				{
					$scope.hist_events = 0;
				}
				else
				{
					$scope.hist_events = 1;
				}
			});
	}
	
	$scope.book_init = function()
	{
		$scope.org_date = sessionStorage.getItem("org_date");
		$scope.facility = sessionStorage.getItem("facility");
		$scope.facilityId = sessionStorage.getItem("facilityId");
	}
	
	$scope.init = function()
	{
		$http({
				method : 'post',
				url : 'php/event.php',
				data : {'b_selected': $scope.b_selected, 'ref': 1}
			}).then(function(response)
			{
				$scope.options = response.data.options;
			});
	}
	
	$scope.check_avl = function()
	{
		if(!$scope.org_date)
		{
			$scope.message = "*Please select a date";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.facility)
		{
			$scope.message = "*Please select a facility";
			document.getElementById("nik-required").style.display = "block";
		}
		else if($scope.b_selected==-1 || !$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
			$http({
				method : 'post',
				url : 'php/event.php',
				data : {'b_selected': $scope.b_selected, 'org_date' : $scope.org_date,
						'facility' : $scope.facility.facility, 'ref': 2}
			}).then(function(response)
			{
				$scope.evt_booked = response.data.evt_booked;
				
				console.log($scope.evt_booked);
				
				if(!$scope.evt_booked)
				{
					sessionStorage.setItem("org_date", $scope.org_date);
					
					var x = $scope.facility.facility;
					sessionStorage.setItem("facility", x);
					
					var id = $scope.facility.id;
					sessionStorage.setItem("facilityId", id);
					
					$scope.available = 1;
				}
				else
				{
					$scope.available = 0;
				}
			});
		}
	}
	
	$scope.search_data = function()
	{
		if(!$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
			if(!"All".localeCompare($scope.search_slt))
			{
				$scope.collect_data();
			}
			else
			{
				if(!$scope.name)
				{
					$scope.message = "*Please enter search key";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					$scope.collect_data();
				}
			}
		}
	}
	
	$scope.collect_data = function()
	{
		$http({
			method : 'post',
			url : 'php/members.php',
			data : {'search_slt' : $scope.search_slt , 'name' : $scope.name , 'b_selected' : $scope.b_selected}
		}).then(function(response)
		{
			$scope.m_details = response.data.m_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
			$scope.memberId = "";
		});
	}
	
	$scope.book = function()
	{
		if(!$scope.purpose)
		{
			$scope.message2 = "*Please enter a purpose";
			document.getElementById("nik-required2").style.display = "block";
		}
		else if($scope.memberId=="")
		{
			$scope.message2 = "*Please select a member";
			document.getElementById("nik-required2").style.display = "block";
		}
		else
		{
			$http({
					method : 'post',
					url : 'php/event.php',
					data : {'b_selected': $scope.b_selected, 'org_date' : $scope.org_date,
						'facilityId' : $scope.facilityId, 'memberId' : $scope.memberId,
						'purpose' : $scope.purpose,'ref': 3}
				}).then(function(response)
				{
					var chkResponse = response.data;
					check_book_status(chkResponse);
				});
		}
	}
	
	$scope.slt_member = function()
	{
		$scope.clear();
		$scope.memberId = document.f2.event_book.value;
	}
	
	$scope.clear = function()
	{
		document.getElementById("nik-required").style.display = "none";
		document.getElementById("nik-required2").style.display = "none";
		$scope.countTest=1;
	}
});

myapp.controller("servicemanCtrl",function($scope,$http)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.options = ["All","Service","Name"];
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.bname = "";
	if(sessionStorage.getItem("bname"))
	{
		$scope.bname = sessionStorage.getItem("bname");
	}
	
	if($scope.bname!="")
	{
		$scope.bname = $scope.bname + " : ";
	}
	
	$scope.count = 0;
	
	$scope.member_profile = function()
	{
		$scope.memberId = sessionStorage.getItem("memberId");
		
		$http({
				method : 'post',
				url : 'php/serviceman_profile.php',
				data : {'memberId' : $scope.memberId}
			}).then(function(response)
			{
				$scope.m_details = response.data.m_details;
			});
	}
	
	$scope.clear = function()
	{
		document.getElementById("nik-required").style.display = "none";
		$scope.countTest=1;
	}
	
	$scope.update_form = function()
	{
		var flag = sessionStorage.getItem("flag");
		
		if(!flag.localeCompare("1"))
		{
			$scope.memberId = sessionStorage.getItem("memberId");
		
			$http({
				method : 'post',
				url : 'php/serviceman_profile.php',
				data : {'memberId' : $scope.memberId}
			}).then(function(response)
			{
				$scope.m_details = response.data.m_details;
				
				$scope.mname = $scope.m_details['name'];
				$scope.contact = parseInt($scope.m_details['contact']);
				$scope.address = $scope.m_details['address'];
				$scope.service = $scope.m_details['service'];
				
			});
		}
	}
	
	$scope.submit_data = function()
	{
		var flag = sessionStorage.getItem("flag");
		
			if(!flag.localeCompare("1"))
			{
				$scope.memberId = sessionStorage.getItem("memberId");
				
				$http({
					method : 'post',
					url : 'php/serviceman_details.php',
					data : {'b_selected': $scope.b_selected, 'mname': $scope.mname, 'contact': $scope.contact, 
					'service': $scope.service, 'address': $scope.address, 'flag': flag,
					'memberId': $scope.memberId}
				}).then(function(response)
				{
					checkResponse = response.data;
					check_status();
				});
			}
			else
			{
				$http({
					method : 'post',
					url : 'php/serviceman_details.php',
					data : {'b_selected': $scope.b_selected, 'mname': $scope.mname, 'contact': $scope.contact, 
					'service': $scope.service, 'address': $scope.address, 'flag': flag}
				}).then(function(response)
				{
					checkResponse = response.data;
					check_status();
				});
			}
	
	}
	
	$scope.search_data = function()
	{
		if(!$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
			if(!"All".localeCompare($scope.search_slt))
			{
				$scope.collect_data();
			}
			else
			{
				if(!$scope.name)
				{
					$scope.message = "*Please enter search key";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					$scope.collect_data();
				}
			}
		}
	}
	
	$scope.collect_data = function()
	{
		$http({
			method : 'post',
			url : 'php/serviceman.php',
			data : {'search_slt' : $scope.search_slt , 'name' : $scope.name , 'b_selected' : $scope.b_selected}
		}).then(function(response)
		{
			$scope.m_details = response.data.m_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
		});
	}
	
	$scope.show_profile = function(memberId)
	{
		sessionStorage.setItem("memberId",memberId);
		window.open("serviceman_profile.html","_self");
	}
	
});

myapp.controller("vehicleCtrl",function($scope,$http)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.options = ["All","Name","Vehicle No"];
	
	$scope.options2 = ["Name","Room No"];
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.bname = "";
	if(sessionStorage.getItem("bname"))
	{
		$scope.bname = sessionStorage.getItem("bname");
	}
	
	if($scope.bname!="")
	{
		$scope.bname = $scope.bname + " : ";
	}
	
	$scope.count = 0;
	
	$scope.clear = function()
	{
		document.getElementById("nik-required").style.display = "none";
		$scope.countTest=1;
		document.getElementById("nik-required2").style.display = "none";
	}
	
	$scope.clear2 = function(memberId)
	{
			$scope.memberId = memberId;
			document.getElementById("nik-required2").style.display = "none";
	}
	
	$scope.update_form = function()
	{
		var flag = sessionStorage.getItem("flag");
		
		if(!flag.localeCompare("1"))
		{
			$scope.vehicleId = sessionStorage.getItem("vehicleId");
		
			$http({
				method : 'post',
				url : 'php/vehicles_profile.php',
				data : {'vehicleId' : $scope.vehicleId}
			}).then(function(response)
			{
				$scope.vehi_details = response.data.m_details;
				
				$scope.vehicleNo = $scope.vehi_details['vehicleNo'];
				$scope.m_details = [{'name': "", 'roomNo': "", 'id': ""}];
				
				$scope.m_details[0]['name'] = $scope.vehi_details['name'];
				$scope.m_details[0]['roomNo'] = $scope.vehi_details['roomNo'];
				$scope.m_details[0]['id'] = $scope.vehi_details['memberId'];
				
				$scope.memberId = $scope.vehi_details['memberId'];
			});
		}
	}
	
	$scope.submit_data = function()
	{
		var flag = sessionStorage.getItem("flag");
		
		if(!$scope.memberId)
		{
			$scope.message2 = "*Please select a member";
			document.getElementById("nik-required2").style.display = "block";
		}
		else
		{
			if(!flag.localeCompare("1"))
			{
				$http({
					method : 'post',
					url : 'php/vehicles_details.php',
					data : {'memberId': $scope.memberId, 'vehicleNo': $scope.vehicleNo, 'flag': flag, 'vehicleId': $scope.vehicleId}
				}).then(function(response)
				{
					checkResponse = response.data;
					check_status();
				});
			}
			else
			{
					$http({
						method : 'post',
						url : 'php/vehicles_details.php',
						data : {'memberId': $scope.memberId, 'vehicleNo': $scope.vehicleNo, 'flag': flag}
					}).then(function(response)
					{
						checkResponse = response.data;
						check_status();
					});
			}
		}
	}
	
	$scope.vehicle_profile = function()
	{
		$scope.vehicleId = sessionStorage.getItem("vehicleId");
		
		$http({
				method : 'post',
				url : 'php/vehicles_profile.php',
				data : {'vehicleId' : $scope.vehicleId}
			}).then(function(response)
			{
				$scope.m_details = response.data.m_details;
			});
	}
	
	$scope.search_data2 = function()
	{
		document.getElementById("nik-required2").style.display = "none";
		
		if(!$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
				if(!$scope.name)
				{
					$scope.message = "*Please enter search key";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					$scope.collect_data2();
				}
		}
	}
	
	$scope.collect_data2 = function()
	{
		$scope.memberId = null;
		
		$http({
			method : 'post',
			url : 'php/member_vehicle.php',
			data : {'search_slt' : $scope.search_slt , 'name' : $scope.name , 'b_selected' : $scope.b_selected}
		}).then(function(response)
		{
			$scope.m_details = response.data.m_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
		});
	}
	
	$scope.search_data = function()
	{
		if(!$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
			if(!"All".localeCompare($scope.search_slt))
			{
				$scope.collect_data();
			}
			else
			{
				if(!$scope.name)
				{
					$scope.message = "*Please enter search key";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					$scope.collect_data();
				}
			}
		}
	}
	
	$scope.show_profile = function(vehicleId)
	{
		sessionStorage.setItem("vehicleId",vehicleId);
		window.open("vehicles_profile.html","_self");
	}
	
	$scope.collect_data = function()
	{	
		$http({
			method : 'post',
			url : 'php/vehicles.php',
			data : {'search_slt' : $scope.search_slt , 'name' : $scope.name , 'b_selected' : $scope.b_selected}
		}).then(function(response)
		{
			$scope.v_details = response.data.v_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
		});
	}
});

myapp.controller("visitorsCtrl",function($scope,$http)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.options = ["All","Today","Yesterday","Date"];
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.bname = "";
	if(sessionStorage.getItem("bname"))
	{
		$scope.bname = sessionStorage.getItem("bname");
	}
	
	if($scope.bname!="")
	{
		$scope.bname = $scope.bname + " : ";
	}
	
	$scope.count = 0;
	
	$scope.clear = function()
	{
		document.getElementById("nik-required").style.display = "none";
		$scope.countTest=1;
	}
	
	$scope.search_data = function()
	{
		if(!$scope.b_selected || $scope.b_selected==-1)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
			if(!"Date".localeCompare($scope.search_slt))
			{
				if(!$scope.date)
				{
					$scope.message = "*Please enter date";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					$scope.collect_data();
				}
			}
			else
			{
				$scope.collect_data();
			}
		}
	}
	
	$scope.show_details = function(visitorId)
	{
		sessionStorage.setItem("visitorId",visitorId);
		window.open("visitor_detail.html","_self");
	}
	
	$scope.visitor_detail = function()
	{
		$scope.visitorId = sessionStorage.getItem("visitorId");
		
		$http({
				method : 'post',
				url : 'php/visitor_detail.php',
				data : {'visitorId' : $scope.visitorId}
			}).then(function(response)
			{
				$scope.v_details = response.data.v_details;
			});
	}
	
	$scope.collect_data = function()
	{
		$http({
			method : 'post',
			url : 'php/visitors.php',
			data : {'search_slt' : $scope.search_slt , 'vdate' : $scope.date , 'b_selected' : $scope.b_selected}
		}).then(function(response)
		{
			$scope.visitors_details = response.data.visitors_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
		});
	}
});

myapp.controller("roomCtrl",function($scope,$http)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.options = ["All","Room No","Vacant Room","On Rent"];
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.bname = "";
	if(sessionStorage.getItem("bname"))
	{
		$scope.bname = sessionStorage.getItem("bname");
	}
	
	if($scope.bname!="")
	{
		$scope.bname = $scope.bname + " : ";
	}
	
	$scope.count = 0;
	
	$scope.room_profile = function()
	{
		$scope.roomId = sessionStorage.getItem("roomId");
		
		$http({
				method : 'post',
				url : 'php/room_profile.php',
				data : {'roomId' : $scope.roomId}
			}).then(function(response)
			{
				$scope.m_details = response.data.m_details;
			});
	}
	
	$scope.update_form = function()
	{
		var flag = sessionStorage.getItem("flag");
		
		if(!flag.localeCompare("1"))
		{
			$scope.roomId = sessionStorage.getItem("roomId");
		
			$http({
				method : 'post',
				url : 'php/room_profile.php',
				data : {'roomId' : $scope.roomId}
			}).then(function(response)
			{
				$scope.m_details = response.data.m_details;
				
				$scope.roomNo = $scope.m_details['roomNo'];
				$scope.maxMemberAllowed = parseInt($scope.m_details['maxMemberAllowed']);
				$scope.noOfMember = $scope.m_details['noOfMember'];
				
				var isRented = $scope.m_details['isRented'];
				var roomType = $scope.m_details['roomType'];
				var genderStay = $scope.m_details['genderStay'];
				
				if(isRented==1)
				{
					var deposit = $scope.m_details['deposit'];
					var rent = $scope.m_details['rentAmt'];
					document.getElementById("rent_radio").checked = true;
					
					document.getElementById("block").innerHTML = 
									'<div class="form-group">'+
                                        '<label class="col-md-12">Deposit</label>'+
                                        '<div class="col-sm-12 col-md-6">'+
                                            '<input type="number" value="'+deposit+'" id="deposit" placeholder="" class="form-control form-control-line" required>'+
                                        '</div>'+
                                    '</div>'+
									
									'<div class="form-group">'+
                                        '<label class="col-md-12">Rent</label>'+
                                        '<div class="col-sm-12 col-md-6">'+
                                            '<input type="number" value="'+rent+'" id="rent" placeholder="" class="form-control form-control-line" required>'+
                                        '</div>'+
                                    '</div>';
				}
				else
				{
					document.getElementById("sold").checked = true;
				}
				
				if(roomType==0)
				{
					document.getElementById("cot").checked = true;
				}
				else if(roomType==1)
				{
					document.getElementById("flat").checked = true;
				}
				else
				{
					document.getElementById("room").checked = true;
				}
				
				if(genderStay==0)
				{
					document.getElementById("male").checked = true;
				}
				else if(genderStay==1)
				{
					document.getElementById("female").checked = true;
				}
				else
				{
					document.getElementById("family").checked = true;
				}
					
			});
		}
	}
	
	$scope.submit_data = function()
	{
		var flag = sessionStorage.getItem("flag");
		
			var stay_type = document.f1.stay_type.value;
			var room_type = document.f1.room_type.value;
			var gender = document.f1.gender.value;
			var deposit = "";
			var rent = "";
			
			if(!stay_type.localeCompare("1"))
			{
				var deposit = document.getElementById("deposit").value;
				var rent = document.getElementById("rent").value;
			}
		
		if(!flag.localeCompare("1"))
		{
			$scope.roomId = sessionStorage.getItem("roomId");
	
			$http({
				method : 'post',
				url : 'php/room_details.php',
				data : {'b_selected': $scope.b_selected, 'roomNo': $scope.roomNo, 'isRented': stay_type, 'rentAmt': rent,
				'roomType': room_type, 'maxMemberAllowed': $scope.maxMemberAllowed, 'noOfMember': $scope.noOfMember, 
				'deposit': deposit, 'genderStay': gender, 'flag': flag, 'roomId': $scope.roomId}
			}).then(function(response)
			{
				checkResponse = response.data;
				check_status();
			});
		}
		else
		{
			$http({
				method : 'post',
				url : 'php/room_details.php',
				data : {'b_selected': $scope.b_selected, 'roomNo': $scope.roomNo, 'isRented': stay_type, 'rentAmt': rent,
				'roomType': room_type, 'maxMemberAllowed': $scope.maxMemberAllowed, 'noOfMember': $scope.noOfMember, 
				'deposit': deposit, 'genderStay': gender, 'flag': flag}
			}).then(function(response)
			{
				checkResponse = response.data;
				check_status();
			});
		}
	}
	
	$scope.room_type = function(x)
	{
		if(x)
		{
			document.getElementById("block").innerHTML = 
									'<div class="form-group">'+
                                        '<label class="col-md-12">Deposit</label>'+
                                        '<div class="col-sm-12 col-md-6">'+
                                            '<input type="number" id="deposit" placeholder="" class="form-control form-control-line" required>'+
                                        '</div>'+
                                    '</div>'+
									
									'<div class="form-group">'+
                                        '<label class="col-md-12">Rent</label>'+
                                        '<div class="col-sm-12 col-md-6">'+
                                            '<input type="number" id="rent" placeholder="" class="form-control form-control-line" required>'+
                                        '</div>'+
                                    '</div>';
		}
		else
		{
			document.getElementById("block").innerHTML = "";
		}
	}
	
	$scope.collect_data = function()
	{
		$http({
			method : 'post',
			url : 'php/room.php',
			data : {'search_slt' : $scope.search_slt , 'name' : $scope.name , 'b_selected' : $scope.b_selected}
		}).then(function(response)
		{
			$scope.m_details = response.data.m_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
		});
	}
	
	$scope.show_profile = function(roomId)
	{
		sessionStorage.setItem("roomId",roomId);
		window.open("room_profile.html","_self");
	}
	
	$scope.search_data = function()
	{
		if(!$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
			if(!"All".localeCompare($scope.search_slt) ||
			!"Vacant Room".localeCompare($scope.search_slt) || 
			!"On Rent".localeCompare($scope.search_slt))
			{
				$scope.collect_data();
			}
			else
			{
				if(!$scope.name)
				{
					$scope.message = "*Please enter search key";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					$scope.collect_data();
				}
			}
		}
	}
	
	$scope.clear = function()
	{
		document.getElementById("nik-required").style.display = "none";
		$scope.countTest=1;
	}
});

myapp.controller("societyCtrl",function($scope,$http)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.bname = "";
	if(sessionStorage.getItem("bname"))
	{
		$scope.bname = sessionStorage.getItem("bname");
	}
	if($scope.bname!="")
	{
		$scope.bname = $scope.bname + " : ";
	}
	
	$scope.update_rules = function()
	{
		$http({
			method: 'post',
			url: 'php/society_details.php',
			data: {'b_selected' : $scope.b_selected, 'rules' : $scope.rules, 'ref' : 4}
		}).then(function(response)
		{
			checkResponse = response.data;
			check_status();
			setTimeout(function(){
				window.open("society_rules.html","_self");
			},"1000");
		});
	}
	
	$scope.dlt_rules = function(id)
	{
		$http({
			method: 'post',
			url: 'php/society_details.php',
			data: {'b_selected' : $scope.b_selected, 'id' : id, 'ref' : 3}
		}).then(function(response)
		{
			checkResponse = response.data;
			check_status();
			setTimeout(function(){
				window.open("society_rules.html","_self");
			},"1000");
		});
	}
	
	$scope.upd_rules = function()
	{
		$http({
			method: 'post',
			url: 'php/society_details.php',
			data: {'b_selected' : $scope.b_selected, 'ref' : 1}
		}).then(function(response)
		{
			$scope.rules = response.data.rules;
		});
	}
	
	$scope.init = function()
	{
		$http({
			method: 'post',
			url: 'php/society_details.php',
			data: {'b_selected' : $scope.b_selected, 'ref' : 1}
		}).then(function(response)
		{
			$scope.rules = response.data.rules;
			$scope.facilities = response.data.facilities;
			$scope.faq = response.data.faq;
			$scope.docs = response.data.docs;
		});
	}
	
	$scope.open_rules = function(x)
	{
		switch(x)
		{
			case 1: window.open("society_add_rule.html","_self");
					break;
			case 2: window.open("society_rules.html","_self");
					break;
			case 3: window.open("society_add_facility.html","_self");
					break;
			case 4: window.open("society_facility.html","_self");
					break;
			case 5: window.open("society_add_doc.html","_self");
					break;
			case 6: window.open("society_doc.html","_self");
					break;
			case 7: window.open("society_add_faq.html","_self");
					break;
			case 8: window.open("society_faq.html","_self");
					break;
		}
	}
	
	$scope.rule_add = function()
	{
		$http({
			method: 'post',
			url: 'php/society_details.php',
			data: {'b_selected' : $scope.b_selected, 'rule' : $scope.rule, 'ref' : 2}
		}).then(function(response)
		{
			checkResponse = response.data;
			check_status();
		});
	}
	
	$scope.open_doc = function(img)
	{
		window.open("images/"+img,"_blank");
	}

	$scope.facility_add = function()
	{
		$http({
			method: 'post',
			url: 'php/society_details.php',
			data: {'b_selected' : $scope.b_selected, 'facility' : $scope.facility, 'ref' : 5}
		}).then(function(response)
		{
			checkResponse = response.data;
			check_status();
		});
	}
	
	$scope.dlt_facility = function(id)
	{
		$http({
			method: 'post',
			url: 'php/society_details.php',
			data: {'b_selected' : $scope.b_selected, 'id' : id, 'ref' : 6}
		}).then(function(response)
		{
			checkResponse = response.data;
			check_status();
			setTimeout(function(){
				window.open("society_facility.html","_self");
			},"1000");
		});
	}
	
	$scope.upd_facilities = function()
	{
		$http({
			method: 'post',
			url: 'php/society_details.php',
			data: {'b_selected' : $scope.b_selected, 'ref' : 7}
		}).then(function(response)
		{
			$scope.facilities = response.data.facilities;
		});
	}
	
	$scope.update_facility = function()
	{
		$http({
			method: 'post',
			url: 'php/society_details.php',
			data: {'b_selected' : $scope.b_selected, 'facilities' : $scope.facilities, 'ref' : 8}
		}).then(function(response)
		{
			checkResponse = response.data;
			check_status();
			setTimeout(function(){
				window.open("society_facility.html","_self");
			},"1000");
		});
	}

	$scope.faq_add = function()
	{
		$http({
			method: 'post',
			url: 'php/society_details.php',
			data: {'b_selected' : $scope.b_selected, 'question' : $scope.question,
					'answer' : $scope.answer, 'ref' : 9}
		}).then(function(response)
		{
			checkResponse = response.data;
			check_status();
		});
	}
	
	$scope.dlt_faq = function(id)
	{
		$http({
			method: 'post',
			url: 'php/society_details.php',
			data: {'b_selected' : $scope.b_selected, 'id' : id, 'ref' : 10}
		}).then(function(response)
		{
			checkResponse = response.data;
			check_status();
			setTimeout(function(){
				window.open("society_faq.html","_self");
			},"1000");
		});
	}
	
	$scope.upd_faq = function()
	{
		$http({
			method: 'post',
			url: 'php/society_details.php',
			data: {'b_selected' : $scope.b_selected, 'ref' : 11}
		}).then(function(response)
		{
			$scope.faq = response.data.faq;
			console.log($scope.faq);
		});
	}
	
	$scope.update_faq = function()
	{
		$http({
			method: 'post',
			url: 'php/society_details.php',
			data: {'b_selected' : $scope.b_selected, 'faq' : $scope.faq, 
					'ref' : 12}
		}).then(function(response)
		{
			checkResponse = response.data;
			check_status();
			setTimeout(function(){
				window.open("society_faq.html","_self");
			},"1000");
		});
	}	

	$scope.upd_doc = function()
	{
		$http({
			method: 'post',
			url: 'php/society_details.php',
			data: {'b_selected' : $scope.b_selected, 'ref' : 13}
		}).then(function(response)
		{
			$scope.doc = response.data.doc;
			console.log($scope.doc);
		});
	}

	$scope.dlt_doc = function(id)
	{
		$http({
			method: 'post',
			url: 'php/society_details.php',
			data: {'b_selected' : $scope.b_selected, 'id' : id, 'ref' : 14}
		}).then(function(response)
		{
			checkResponse = response.data;
			check_status();
			setTimeout(function(){
				window.open("society_doc.html","_self");
			},"1000");
		});
	}

});

myapp.controller("complainCtrl",function($scope,$http)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.options = ["All","Unsolved","Progress","Solved"];
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.bname = "";
	if(sessionStorage.getItem("bname"))
	{
		$scope.bname = sessionStorage.getItem("bname");
	}
	
	if($scope.bname!="")
	{
		$scope.bname = $scope.bname + " : ";
	}
	
	$scope.count = 0;
	
	$scope.close_pop = function()
	{
		document.getElementById("nik-pop-con").style.animationName = "";
		document.getElementById("nik-pop").style.display = "none";
	}
	
	$scope.change_status = function()
	{
		$scope.ch_status = document.f2.c_status.value;
		
		$http({
				method : 'post',
				url : 'php/complain_status.php',
				data : {'complainId' : $scope.complainId, 'status' : $scope.ch_status}
			}).then(function(response)
			{
				if(response.data)
				{
					document.getElementById("success").style.display = "block";
					
					for(i=0;i<$scope.c_details.length;i++)
					{
						if($scope.c_details[i]['id']==$scope.complainId)
						{
							$scope.c_details[i]['status'] = $scope.ch_status;
						}
					}
				}
				else
				{
					document.getElementById("failed").style.display = "block";
				}
					
				setTimeout(function()
				{
					document.getElementById("nik-pop-con").style.animationName = "";
					document.getElementById("nik-pop").style.display = "none";
					document.getElementById("success").style.display = "none";
					document.getElementById("failed").style.display = "none";
				},'500');
			});
	}
	
	$scope.change_status2 = function()
	{
		$scope.ch_status = document.f2.c_status.value;
		
		$http({
				method : 'post',
				url : 'php/complain_status.php',
				data : {'complainId' : $scope.complainId, 'status' : $scope.ch_status}
			}).then(function(response)
			{
				if(response.data)
				{
					document.getElementById("success").style.display = "block";
				
					$scope.comp_details['status'] = $scope.ch_status;
				}
				else
				{
					document.getElementById("failed").style.display = "block";
				}
					
				setTimeout(function()
				{
					document.getElementById("nik-pop-con").style.animationName = "";
					document.getElementById("nik-pop").style.display = "none";
					document.getElementById("success").style.display = "none";
					document.getElementById("failed").style.display = "none";
				},'500');
			});
	}
	
	$scope.change_pop = function(id)
	{
		document.getElementById("nik-pop-con").style.animationName = "nikanimate";
		document.getElementById("nik-pop").style.display = "block";
		$scope.complainId = id;
	}
	
	$scope.complain_d = function()
	{
		$scope.complainId = sessionStorage.getItem("complainId");
		
		$http({
				method : 'post',
				url : 'php/complain_d.php',
				data : {'b_selected' : $scope.b_selected, 'complainId' : $scope.complainId}
			}).then(function(response)
			{
				$scope.comp_details = response.data.c_details;
			});
	}
	
	$scope.clear = function()
	{
		document.getElementById("nik-required").style.display = "none";
		$scope.countTest=1;
	}
	
	$scope.search_data = function()
	{
		if(!$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
			$scope.collect_data();
		}
	}
	
	$scope.collect_data = function()
	{
		$http({
			method : 'post',
			url : 'php/complain.php',
			data : {'search_slt' : $scope.search_slt , 'name' : $scope.name , 'b_selected' : $scope.b_selected}
		}).then(function(response)
		{
			$scope.c_details = response.data.c_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
		});
	}
	
	$scope.complain_details = function(complainId)
	{
		sessionStorage.setItem("complainId",complainId);
		window.open("complain_details.html","_self");
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

myapp.controller("messageCtrl",function($scope,$http)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.bname = "";
	if(sessionStorage.getItem("bname"))
	{
		$scope.bname = sessionStorage.getItem("bname");
	}
	
	if($scope.bname!="")
	{
		$scope.bname = $scope.bname + " : ";
	}
	
	$scope.options = ["All","Room No","Name"];
	
	$scope.count = 0;
	
	$scope.sendToMem = [];
	$scope.sendToRoom = [];
	
	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
		document.getElementById("tp").scrollIntoView();
		window.scrollTo(0, 0);
	});
	
	$scope.init = function()
	{	
		$http({
			method : 'post',
			url : 'php/message.php',
			data : {'b_selected' : $scope.b_selected}
		}).then(function(response)
		{
			$scope.message = response.data.message;
			console.log($scope.message);
		});
	}
	
	$scope.clear = function()
	{
		document.getElementById("nik-required2").style.display = "none";
		document.getElementById("nik-required").style.display = "none";
		$scope.countTest=1;
	}
	
	$scope.search_data = function()
	{
		if(!$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
			if(!"All".localeCompare($scope.search_slt))
			{
				$scope.collect_data();
			}
			else
			{
				if(!$scope.name)
				{
					$scope.message = "*Please enter search key";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					$scope.collect_data();
				}
			}
		}
	}
	
	$scope.collect_data = function()
	{
		$http({
			method : 'post',
			url : 'php/members.php',
			data : {'search_slt' : $scope.search_slt , 'name' : $scope.name , 'b_selected' : $scope.b_selected}
		}).then(function(response)
		{
			$scope.m_details = response.data.m_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
		});
	}
	
	$scope.sendTo = function(id,roomNo)
	{
		var x = document.getElementById("chkbox"+id).checked;
		
		if(x)
		{
			for(i=0;i<$scope.sendToMem.length;i++)
			{
				if(id==$scope.sendToMem[i])
				{
					break;
				}
			}
			if(i==$scope.sendToMem.length)
			{
				$scope.sendToMem.push(id);
				$scope.sendToRoom.push(roomNo);
			}
		}
		else
		{
			for(i=0;i<$scope.sendToMem.length;i++)
			{
				if(id==$scope.sendToMem[i])
				{
					$scope.sendToMem.splice(i,1);
					$scope.sendToRoom.splice(i,1);
					break;
				}
			}
		}
		console.log($scope.sendToMem);
	}
	
	$scope.send = function()
	{
		var x = document.getElementById("message").value;
		
		var y = document.getElementById("sendAll").checked;
		
		if(x=="")
		{
			$scope.message2 = "*Please enter a message";
			document.getElementById("nik-required2").style.display = "block";
		}
		else if(!y && !$scope.sendToMem.length)
		{
			$scope.message2 = "*Please select members to send";
			document.getElementById("nik-required2").style.display = "block";
		}
		else
		{
			if(y)
			{
				$http({
						method : 'post',
						url : 'php/send_message.php',
						data : {'b_selected' : $scope.b_selected, 'message' : $scope.txtMessage, 'ref' : 1}
					}).then(function(response)
					{
						chkResponse = response.data;
						check_msg_status(chkResponse);
					});
			}
			else
			{
				$http({
						method : 'post',
						url : 'php/send_message.php',
						data : {'b_selected' : $scope.b_selected, 'message' : $scope.txtMessage, 
						'members' : $scope.sendToMem,'ref' : 2}
					}).then(function(response)
					{
						chkResponse = response.data;
						check_msg_status(chkResponse);
					});
			}
		}
	}
	
});

myapp.controller("accountCtrl",function($scope,$http)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.bname = "";
	if(sessionStorage.getItem("bname"))
	{
		$scope.bname = sessionStorage.getItem("bname");
	}
	
	if($scope.bname!="")
	{
		$scope.bname = $scope.bname + " : ";
	}
	
	$scope.open_menu = function(x)
	{
		switch(x)
		{
			case 1: window.open("rent_maintenance.html","_self");
					break;
			case 2: window.open("light_bill.html","_self");
					break;
			case 3: window.open("income.html","_self");
					break;
			case 4: window.open("expense.html","_self");
					break;
			case 5: window.open("fine_collection.html","_self");
					break;
			case 6: window.open("event_collection.html","_self");
					break;
		}
	}
	
});

myapp.controller("rentCtrl",function($scope,$http)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.options = ["All","Name","Room No"];
	
	$scope.months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
	
	$scope.bname = "";
	if(sessionStorage.getItem("bname"))
	{
		$scope.bname = sessionStorage.getItem("bname");
	}
	
	if($scope.bname!="")
	{
		$scope.bname = $scope.bname + " : ";
	}
	
	$scope.count = 0;
	
	$scope.updateFlag = 0;
	
	$scope.update_rent = function()
	{
		if($scope.updateFlag==0)
		{
			$scope.updateFlag = 1;
		}
		else
		{
			$http({
				method : 'post',
				url : 'php/rent_received.php',
				data : {'b_selected' : $scope.b_selected, 'rent_details' : $scope.rent_details,
				'member_rent' : $scope.member_rent, 'ref' : 6}
			}).then(function(response)
			{
				checkResponse = response.data;
				check_status();
				$scope.updateFlag = 0;
			});
		}
	}
	
	$scope.filter_by = function()
	{
		$scope.choice = document.f2.rent_mode.value;
		$scope.clear();
	}
	
	$scope.rent_pending_detail = function()
	{
		$scope.memberId = sessionStorage.getItem("memberId");
		
		$http({
				method : 'post',
				url : 'php/rent_received.php',
				data : {'b_selected' : $scope.b_selected, 'memberId' : $scope.memberId, 'ref' : 3}
			}).then(function(response)
			{
				$scope.rent_details = response.data.rent_details;
				console.log($scope.rent_details);
			});
	}
	
	$scope.delete_rent = function(id)
	{
		$http({
				method : 'post',
				url : 'php/rent_received.php',
				data : {'b_selected' : $scope.b_selected, 'id' : id, 'ref' : 5}
			}).then(function(response)
			{
				checkResponse = response.data;
				check_status();
			});
	}
	
	$scope.rent_status_detail = function()
	{
		$scope.memberId = sessionStorage.getItem("memberId");
		
		console.log($scope.memberId);
		
		$http({
				method : 'post',
				url : 'php/rent_received.php',
				data : {'b_selected' : $scope.b_selected, 'memberId' : $scope.memberId, 'ref' : 4}
			}).then(function(response)
			{
				$scope.rent_details = response.data.rent_details;
				$scope.member_rent = response.data.member_rent;
				
				console.log($scope.rent_details);
				console.log($scope.member_rent);
			});
	}
	
	$scope.rent_status = function(memberId)
	{
		sessionStorage.setItem("memberId",memberId);
		window.open("rent_status.html","_self");
	}
	
	$scope.pending_rent = function(memberId)
	{
		sessionStorage.setItem("memberId",memberId);
		window.open("pending_rent.html","_self");
	}
	
	$scope.search_by_choice = function()
	{
		if(!$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
			if(!"All".localeCompare($scope.search_slt))
			{
				if(!$scope.choice)
				{
					$scope.message = "*Please select a choice";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					$scope.collect_info();
				}
			}
			else
			{
				if(!$scope.name)
				{
					$scope.message = "*Please enter search key";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					if(!$scope.choice)
					{
						$scope.message = "*Please select a choice";
						document.getElementById("nik-required").style.display = "block";
					}
					else
					{
						$scope.collect_info();
					}
				}
			}
		}
	}
	
	$scope.collect_info = function()
	{	
		$http({
			method : 'post',
			url : 'php/rent_received.php',
			data : {'search_slt' : $scope.search_slt , 'name' : $scope.name , 'b_selected' : $scope.b_selected,
			'choice' : $scope.choice, 'ref' : 2}
		}).then(function(response)
		{
			$scope.rent_details = response.data.rent_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
			$scope.Mychoice = $scope.choice;
			
			console.log($scope.rent_details);
		});
	}
	
	$scope.rent_rvd = function()
	{
		window.open("rent_received.html","_self");
	}
	
	$scope.clear = function()
	{
		document.getElementById("nik-required").style.display = "none";
		document.getElementById("nik-required2").style.display = "none";
		$scope.countTest=1;
	}
	
	$scope.clear2 = function(memberId)
	{
			$scope.memberId = memberId;
			document.getElementById("nik-required2").style.display = "none";
	}
	
	$scope.search_data = function()
	{
		if(!$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
			if(!"All".localeCompare($scope.search_slt))
			{
				$scope.collect_data();
			}
			else
			{
				if(!$scope.name)
				{
					$scope.message = "*Please enter search key";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					$scope.collect_data();
				}
			}
		}
	}
	
	$scope.collect_data = function()
	{
		$scope.memberId = null;
		
		$http({
			method : 'post',
			url : 'php/members.php',
			data : {'search_slt' : $scope.search_slt , 'name' : $scope.name , 'b_selected' : $scope.b_selected}
		}).then(function(response)
		{
			$scope.m_details = response.data.m_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
		});
	}
	
	$scope.submit_data = function()
	{
		if($scope.amount=="" || !$scope.amount)
		{
			$scope.message2 = "*Please enter amount";
			document.getElementById("nik-required2").style.display = "block";
		}
		else if($scope.year=="" || !$scope.year)
		{
			$scope.message2 = "*Please enter year";
			document.getElementById("nik-required2").style.display = "block";
		}
		else if(!$scope.month)
		{
			$scope.message2 = "*Please enter month";
			document.getElementById("nik-required2").style.display = "block";
		}
		else if($scope.date=="" || !$scope.date)
		{
			$scope.message2 = "*Please enter date";
			document.getElementById("nik-required2").style.display = "block";
		}
		else if(!$scope.memberId)
		{
			$scope.message2 = "*Please select a member";
			document.getElementById("nik-required2").style.display = "block";
		}
		else
		{
			$http({
				method : 'post',
				url : 'php/rent_received.php',
				data : {'amount' : $scope.amount, 'year' : $scope.year, 'month' : $scope.month,
				'memberId' : $scope.memberId, 'date' : $scope.date,
				'b_selected' : $scope.b_selected, 'ref' : 1}
			}).then(function(response)
			{
				chkResponse = response.data;
				check_status(chkResponse);
			});
		}
	}
});

myapp.controller("lightBillCtrl",function($scope,$http)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.options = ["All","Name","Room No"];
	
	$scope.months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
	
	$scope.bname = "";
	if(sessionStorage.getItem("bname"))
	{
		$scope.bname = sessionStorage.getItem("bname");
	}
	
	if($scope.bname!="")
	{
		$scope.bname = $scope.bname + " : ";
	}
	
	$scope.count = 0;
	
	$scope.updateFlag = 0;
	
	$scope.update_bill = function()
	{
		if($scope.updateFlag==0)
		{
			$scope.updateFlag = 1;
		}
		else
		{
			$http({
				method : 'post',
				url : 'php/bill_received.php',
				data : {'b_selected' : $scope.b_selected, 'bill_details' : $scope.bill_details,
				'member' : $scope.member, 'ref' : 6}
			}).then(function(response)
			{
				checkResponse = response.data;
				check_status();
				$scope.updateFlag = 0;
			});
		}
	}
	
	$scope.filter_by = function()
	{
		$scope.choice = document.f2.rent_mode.value;
		$scope.clear();
	}
	
	$scope.bill_pending_detail = function()
	{
		$scope.memberId = sessionStorage.getItem("memberId");
		
		$http({
				method : 'post',
				url : 'php/bill_received.php',
				data : {'b_selected' : $scope.b_selected, 'memberId' : $scope.memberId, 'ref' : 3}
			}).then(function(response)
			{
				$scope.bill_details = response.data.bill_details;
				console.log($scope.bill_details);
			});
	}
	
	$scope.delete_bill = function(id)
	{
		$http({
				method : 'post',
				url : 'php/bill_received.php',
				data : {'b_selected' : $scope.b_selected, 'id' : id, 'ref' : 5}
			}).then(function(response)
			{
				checkResponse = response.data;
				check_status();
			});
	}
	
	
	$scope.bill_status_detail = function()
	{
		$scope.memberId = sessionStorage.getItem("memberId");
		
		console.log($scope.memberId);
		
		$http({
				method : 'post',
				url : 'php/bill_received.php',
				data : {'b_selected' : $scope.b_selected, 'memberId' : $scope.memberId, 'ref' : 4}
			}).then(function(response)
			{
				$scope.bill_details = response.data.bill_details;
				$scope.member = response.data.member;
				
				console.log($scope.bill_details);
				console.log($scope.member);
			});
	}
	
	
	$scope.bill_status = function(memberId)
	{
		sessionStorage.setItem("memberId",memberId);
		window.open("bill_status.html","_self");
	}
	
	$scope.pending_bill = function(memberId)
	{
		sessionStorage.setItem("memberId",memberId);
		window.open("pending_bill.html","_self");
	}

	$scope.search_by_choice = function()
	{
		if(!$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
			if(!"All".localeCompare($scope.search_slt))
			{
				if(!$scope.choice)
				{
					$scope.message = "*Please select a choice";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					$scope.collect_info();
				}
			}
			else
			{
				if(!$scope.name)
				{
					$scope.message = "*Please enter search key";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					if(!$scope.choice)
					{
						$scope.message = "*Please select a choice";
						document.getElementById("nik-required").style.display = "block";
					}
					else
					{
						$scope.collect_info();
					}
				}
			}
		}
	}
	
	
	$scope.collect_info = function()
	{	
		$http({
			method : 'post',
			url : 'php/bill_received.php',
			data : {'search_slt' : $scope.search_slt , 'name' : $scope.name , 'b_selected' : $scope.b_selected,
			'choice' : $scope.choice, 'ref' : 2}
		}).then(function(response)
		{
			$scope.bill_details = response.data.bill_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
			$scope.Mychoice = $scope.choice;
			
			console.log($scope.bill_details);
		});
	}
	
	$scope.bill_rvd = function()
	{
		window.open("bill_received.html","_self");
	}
	
	$scope.bill_add = function()
	{
		window.open("bill_add.html","_self");
	}
	
	$scope.clear = function()
	{
		document.getElementById("nik-required").style.display = "none";
		document.getElementById("nik-required2").style.display = "none";
		$scope.countTest=1;
	}
	
	$scope.clear2 = function(memberId)
	{
			$scope.memberId = memberId;
			document.getElementById("nik-required2").style.display = "none";
	}
	
	$scope.search_data = function()
	{
		if(!$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
			if(!"All".localeCompare($scope.search_slt))
			{
				$scope.collect_data();
			}
			else
			{
				if(!$scope.name)
				{
					$scope.message = "*Please enter search key";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					$scope.collect_data();
				}
			}
		}
	}
	
	$scope.collect_data = function()
	{
		$scope.memberId = null;
		
		$http({
			method : 'post',
			url : 'php/members.php',
			data : {'search_slt' : $scope.search_slt , 'name' : $scope.name , 'b_selected' : $scope.b_selected}
		}).then(function(response)
		{
			$scope.m_details = response.data.m_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
		});
	}
	
	
	$scope.submit_data = function()
	{
		if($scope.amount=="" || !$scope.amount)
		{
			$scope.message2 = "*Please enter amount";
			document.getElementById("nik-required2").style.display = "block";
		}
		else if($scope.year=="" || !$scope.year)
		{
			$scope.message2 = "*Please enter year";
			document.getElementById("nik-required2").style.display = "block";
		}
		else if(!$scope.month)
		{
			$scope.message2 = "*Please enter month";
			document.getElementById("nik-required2").style.display = "block";
		}
		else if($scope.date=="" || !$scope.date)
		{
			$scope.message2 = "*Please enter date";
			document.getElementById("nik-required2").style.display = "block";
		}
		else if(!$scope.memberId)
		{
			$scope.message2 = "*Please select a member";
			document.getElementById("nik-required2").style.display = "block";
		}
		else
		{
			$http({
				method : 'post',
				url : 'php/bill_received.php',
				data : {'amount' : $scope.amount, 'year' : $scope.year, 'month' : $scope.month,
				'memberId' : $scope.memberId, 'date' : $scope.date,
				'b_selected' : $scope.b_selected, 'ref' : 1}
			}).then(function(response)
			{
				chkResponse = response.data;
				check_status(chkResponse);
			});
		}
	}
	
	
	$scope.submit_data_add = function()
	{
		if($scope.units=="" || !$scope.units)
		{
			$scope.message2 = "*Please enter units";
			document.getElementById("nik-required2").style.display = "block";
		}
		else if($scope.year=="" || !$scope.year)
		{
			$scope.message2 = "*Please enter year";
			document.getElementById("nik-required2").style.display = "block";
		}
		else if(!$scope.month)
		{
			$scope.message2 = "*Please enter month";
			document.getElementById("nik-required2").style.display = "block";
		}
		else if(!$scope.memberId)
		{
			$scope.message2 = "*Please select a member";
			document.getElementById("nik-required2").style.display = "block";
		}
		else
		{
			$http({
				method : 'post',
				url : 'php/bill_received.php',
				data : {'units' : $scope.units, 'year' : $scope.year, 'month' : $scope.month,
				'memberId' : $scope.memberId,
				'b_selected' : $scope.b_selected, 'ref' : 7}
			}).then(function(response)
			{
				chkResponse = response.data;
				check_status(chkResponse);
			});
		}
	}
});

myapp.controller("incomeCtrl",function($scope,$http)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.bname = "";
	if(sessionStorage.getItem("bname"))
	{
		$scope.bname = sessionStorage.getItem("bname");
	}
	
	if($scope.bname!="")
	{
		$scope.bname = $scope.bname + " : ";
	}
	
	$scope.total = 0;
	
	$scope.income = function()
	{
		$http({
				method : 'post',
				url : 'php/income.php',
				data : {'b_selected' : $scope.b_selected, 'ref' : 1}
			}).then(function(response)
			{
				$scope.income_details = response.data.income_details;
				$scope.total = response.data.total;
				console.log($scope.income_details);
			});
	}
	
	$scope.income_add = function()
	{
		sessionStorage.setItem("update",0);
		window.open("income_add.html","_self");
	}
	
	$scope.in_add = function()
	{
		$scope.update = sessionStorage.getItem("update");
		
		if($scope.update==1)
		{
			$scope.id = sessionStorage.getItem("id");
		
			$http({
				method : 'post',
				url : 'php/income.php',
				data : {'b_selected' : $scope.b_selected, 'id' : $scope.id, 'ref' : 3}
			}).then(function(response)
			{
				$scope.income_details = response.data.income_details;
				
				$scope.amount = $scope.income_details[0]['amt'];
				$scope.date = $scope.income_details[0]['date'];
				$scope.note = $scope.income_details[0]['note'];
			});
		}
	}
	
	$scope.income_det = function(id)
	{
		sessionStorage.setItem("id",id);
		window.open("income_update.html","_self");
	}
	
	$scope.submit_data = function()
	{
		if($scope.update==0)
		{
			$http({
					method : 'post',
					url : 'php/income.php',
					data : {'b_selected' : $scope.b_selected, 'update' : $scope.update, 'ref' : 2,
							'amount' : $scope.amount, 'date' : $scope.date, 'note' : $scope.note}
				}).then(function(response)
				{
					checkResponse = response.data;
					check_status();
				});
		}
		else
		{
			$scope.id = sessionStorage.getItem("id");
			
			$http({
					method : 'post',
					url : 'php/income.php',
					data : {'b_selected' : $scope.b_selected, 'update' : $scope.update, 'ref' : 2,
							'amount' : $scope.amount, 'date' : $scope.date, 'note' : $scope.note,
							'id' : $scope.id}
				}).then(function(response)
				{
					checkResponse = response.data;
					check_status();
				});
		}
	}
	
	$scope.in_update = function()
	{
		$scope.id = sessionStorage.getItem("id");
		
		$http({
				method : 'post',
				url : 'php/income.php',
				data : {'b_selected' : $scope.b_selected, 'id' : $scope.id, 'ref' : 3}
			}).then(function(response)
			{
				$scope.income_details = response.data.income_details;
				
				console.log($scope.income_details);
			});
	}
	
	$scope.income_update = function()
	{
		sessionStorage.setItem("update",1);
		window.open("income_add.html","_self");
	}
	
	$scope.income_delete = function()
	{
		$http({
				method : 'post',
				url : 'php/income.php',
				data : {'b_selected' : $scope.b_selected, 'id' : $scope.id, 'ref' : 4}
			}).then(function(response)
			{
				checkResponse = response.data;
				check_status();
				window.open("income.html","_self")
			});
	}
});

myapp.controller("expenseCtrl",function($scope,$http)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.bname = "";
	if(sessionStorage.getItem("bname"))
	{
		$scope.bname = sessionStorage.getItem("bname");
	}
	
	if($scope.bname!="")
	{
		$scope.bname = $scope.bname + " : ";
	}
	
	$scope.total = 0;
	
	$scope.expense = function()
	{
		$http({
				method : 'post',
				url : 'php/expense.php',
				data : {'b_selected' : $scope.b_selected, 'ref' : 1}
			}).then(function(response)
			{
				$scope.expense_details = response.data.expense_details;
				$scope.total = response.data.total;
				console.log($scope.expense_details);
			});
	}
	
	$scope.expense_add = function()
	{
		sessionStorage.setItem("update",0);
		window.open("expense_add.html","_self");
	}
	
	$scope.ex_add = function()
	{
		$scope.update = sessionStorage.getItem("update");
		
		if($scope.update==1)
		{
			$scope.id = sessionStorage.getItem("id");
		
			$http({
				method : 'post',
				url : 'php/expense.php',
				data : {'b_selected' : $scope.b_selected, 'id' : $scope.id, 'ref' : 3}
			}).then(function(response)
			{
				$scope.expense_details = response.data.expense_details;
				
				$scope.amount = $scope.expense_details[0]['amt'];
				$scope.date = $scope.expense_details[0]['date'];
				$scope.note = $scope.expense_details[0]['note'];
			});
		}
	}
	
	$scope.expense_det = function(id)
	{
		sessionStorage.setItem("id",id);
		window.open("expense_update.html","_self");
	}
	
	$scope.submit_data = function()
	{
		if($scope.update==0)
		{
			$http({
					method : 'post',
					url : 'php/expense.php',
					data : {'b_selected' : $scope.b_selected, 'update' : $scope.update, 'ref' : 2,
							'amount' : $scope.amount, 'date' : $scope.date, 'note' : $scope.note}
				}).then(function(response)
				{
					checkResponse = response.data;
					check_status();
				});
		}
		else
		{
			$scope.id = sessionStorage.getItem("id");
			
			$http({
					method : 'post',
					url : 'php/expense.php',
					data : {'b_selected' : $scope.b_selected, 'update' : $scope.update, 'ref' : 2,
							'amount' : $scope.amount, 'date' : $scope.date, 'note' : $scope.note,
							'id' : $scope.id}
				}).then(function(response)
				{
					checkResponse = response.data;
					check_status();
				});
		}
	}
	
	$scope.ex_update = function()
	{
		$scope.id = sessionStorage.getItem("id");
		
		$http({
				method : 'post',
				url : 'php/expense.php',
				data : {'b_selected' : $scope.b_selected, 'id' : $scope.id, 'ref' : 3}
			}).then(function(response)
			{
				$scope.expense_details = response.data.expense_details;
				
				console.log($scope.expense_details);
			});
	}
	
	$scope.expense_update = function()
	{
		sessionStorage.setItem("update",1);
		window.open("expense_add.html","_self");
	}
	
	$scope.expense_delete = function()
	{
		$http({
				method : 'post',
				url : 'php/expense.php',
				data : {'b_selected' : $scope.b_selected, 'id' : $scope.id, 'ref' : 4}
			}).then(function(response)
			{
				checkResponse = response.data;
				check_status();
				window.open("expense.html","_self")
			});
	}
	
});

myapp.controller("fineCollectionCtrl",function($scope,$http)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.options = ["All","Name","Room No"];
	
	$scope.options2 = ["Name","Room No"];
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.bname = "";
	if(sessionStorage.getItem("bname"))
	{
		$scope.bname = sessionStorage.getItem("bname");
	}
	
	if($scope.bname!="")
	{
		$scope.bname = $scope.bname + " : ";
	}
		
	$scope.clear = function()
	{
		document.getElementById("nik-required").style.display = "none";
		$scope.countTest=1;
	}
	
	$scope.clear2 = function(memberId)
	{
			$scope.memberId = memberId;
			document.getElementById("nik-required2").style.display = "none";
	}
	
	$scope.search_data = function()
	{
		document.getElementById("nik-required2").style.display = "none";
		
		if(!$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
			if(!"All".localeCompare($scope.search_slt))
			{
				$scope.collect_data();
			}
			else
			{
				if(!$scope.name)
				{
					$scope.message = "*Please enter search key";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					$scope.collect_data();
				}
			}
		}
	}
	
	$scope.collect_data = function()
	{
		$http({
			method : 'post',
			url : 'php/fine_collection.php',
			data : {'search_slt' : $scope.search_slt , 'name' : $scope.name , 
					'b_selected' : $scope.b_selected, 'ref' : 1}
		}).then(function(response)
		{
			$scope.fineCollection_details = response.data.fineCollection_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
		});
	}
	
	$scope.fineCollection_add = function()
	{
		sessionStorage.setItem("update",0);
		window.open("fine_collection_add.html","_self");
	}
	
	$scope.fc_add = function()
	{
		$scope.update = sessionStorage.getItem("update");
		
		if($scope.update==1)
		{
			$scope.id = sessionStorage.getItem("id");
		
			$http({
				method : 'post',
				url : 'php/fine_collection.php',
				data : {'b_selected' : $scope.b_selected, 'id' : $scope.id, 'ref' : 3}
			}).then(function(response)
			{
				$scope.fineCollection_details = response.data.fineCollection_details;
				
				$scope.amount = $scope.fineCollection_details[0]['amt'];
				$scope.date = $scope.fineCollection_details[0]['date'];
				$scope.reason = $scope.fineCollection_details[0]['reason'];
				
				$scope.m_details = [{'name': "", 'roomNo': "", 'id': ""}];
				
				$scope.m_details[0]['name'] = $scope.fineCollection_details[0]['name'];
				$scope.m_details[0]['roomNo'] = $scope.fineCollection_details[0]['roomNo'];
				$scope.m_details[0]['id'] = $scope.fineCollection_details[0]['memberId'];
				
				$scope.memberId = $scope.fineCollection_details[0]['memberId'];
			});
		}
	}
	
	$scope.search_data2 = function()
	{
		if(!$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
				if(!$scope.name)
				{
					$scope.message = "*Please enter search key";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					$scope.collect_data2();
				}
		}
	}
	
	$scope.collect_data2 = function()
	{
		$scope.memberId = null;
		
		$http({
			method : 'post',
			url : 'php/fine_collection.php',
			data : {'search_slt' : $scope.search_slt , 'name' : $scope.name , 'b_selected' : $scope.b_selected,
					'ref' : 5}
		}).then(function(response)
		{
			$scope.m_details = response.data.m_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
		});
	}
	
	$scope.fineCollection_det = function(id)
	{
		sessionStorage.setItem("id",id);
		window.open("fine_collection_update.html","_self");
	}
	
	$scope.submit_data = function()
	{
		if(!$scope.memberId)
		{
			$scope.message2 = "*Please select a member";
			document.getElementById("nik-required2").style.display = "block";
		}
		else
		{
			if($scope.update==1)
			{
				$scope.id = sessionStorage.getItem("id");
				
				$http({
					method : 'post',
					url : 'php/fine_collection.php',
					data : {'memberId': $scope.memberId, 'b_selected' : $scope.b_selected, 
							'update' : $scope.update, 'ref' : 2,
							'amount' : $scope.amount, 'date' : $scope.date, 'reason' : $scope.reason,
							'id' : $scope.id}
				}).then(function(response)
				{
					checkResponse = response.data;
					check_status();
				});
			}
			else
			{
					$http({
						method : 'post',
						url : 'php/fine_collection.php',
						data : {'memberId': $scope.memberId, 'b_selected' : $scope.b_selected, 
							'update' : $scope.update, 'ref' : 2,
							'amount' : $scope.amount, 'date' : $scope.date, 'reason' : $scope.reason}
					}).then(function(response)
					{
						checkResponse = response.data;
						check_status();
					});
			}
		}
	}
	
	$scope.fc_update = function()
	{
		$scope.id = sessionStorage.getItem("id");
		
		$http({
				method : 'post',
				url : 'php/fine_collection.php',
				data : {'b_selected' : $scope.b_selected, 'id' : $scope.id, 'ref' : 3}
			}).then(function(response)
			{
				$scope.fineCollection_details = response.data.fineCollection_details;
				
				console.log($scope.fineCollection_details);
			});
	}
	
	$scope.fineCollection_update = function()
	{
		sessionStorage.setItem("update",1);
		window.open("fine_collection_add.html","_self");
	}
	
	$scope.fineCollection_delete = function()
	{
		$http({
				method : 'post',
				url : 'php/fine_collection.php',
				data : {'b_selected' : $scope.b_selected, 'id' : $scope.id, 'ref' : 4}
			}).then(function(response)
			{
				checkResponse = response.data;
				check_status();
				window.open("fine_collection.html","_self")
			});
	}
	
	
});

myapp.controller("eventCollectionCtrl",function($scope,$http)
{
	$scope.adminName = sessionStorage.getItem("adminName");
	
	$scope.options = ["All","Event"];
	
	$scope.options2 = ["Name","Room No"];
	
	$scope.b_selected = sessionStorage.getItem("b_selected");
	
	$scope.bname = "";
	if(sessionStorage.getItem("bname"))
	{
		$scope.bname = sessionStorage.getItem("bname");
	}
	
	if($scope.bname!="")
	{
		$scope.bname = $scope.bname + " : ";
	}
	
	$scope.clear2 = function(memberId)
	{
			$scope.memberId = memberId;
			document.getElementById("nik-required2").style.display = "none";
	}
	
	$scope.search_data2 = function()
	{
		if(!$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
				if(!$scope.name)
				{
					$scope.message = "*Please enter search key";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					$scope.collect_data2();
				}
		}
	}
	
	$scope.collect_data2 = function()
	{
		$scope.memberId = null;
		
		$http({
			method : 'post',
			url : 'php/event_collection.php',
			data : {'search_slt' : $scope.search_slt , 'name' : $scope.name , 'b_selected' : $scope.b_selected,
					'ref' : 5}
		}).then(function(response)
		{
			$scope.m_details = response.data.m_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
		});
	}
	
	$scope.clear = function()
	{
		document.getElementById("nik-required").style.display = "none";
		$scope.countTest=1;
	}
	
	$scope.search_data = function()
	{	
		if(!$scope.b_selected)
		{
			$scope.message = "*Please select a building from Profile";
			document.getElementById("nik-required").style.display = "block";
		}
		else if(!$scope.search_slt)
		{
			$scope.message = "*Please select search type";
			document.getElementById("nik-required").style.display = "block";
		}
		else
		{
			if(!"All".localeCompare($scope.search_slt))
			{
				$scope.collect_data();
			}
			else
			{
				if(!$scope.name)
				{
					$scope.message = "*Please enter search key";
					document.getElementById("nik-required").style.display = "block";
				}
				else
				{
					$scope.collect_data();
				}
			}
		}
	}
	
	$scope.collect_data = function()
	{
		$http({
			method : 'post',
			url : 'php/event_collection.php',
			data : {'search_slt' : $scope.search_slt , 'name' : $scope.name , 
					'b_selected' : $scope.b_selected, 'ref' : 1}
		}).then(function(response)
		{
			$scope.eventCollection_details = response.data.eventCollection_details;
			$scope.count = response.data.count;
			$scope.countTest = $scope.count;
			
			console.log($scope.eventCollection_details);
		});
	}
	
	$scope.eventCollection_add = function()
	{
		sessionStorage.setItem("update",0);
		window.open("event_collection_add.html","_self");
	}
	
	$scope.ec_add = function()
	{
		$scope.update = sessionStorage.getItem("update");
		
		if($scope.update==1)
		{
			$scope.id = sessionStorage.getItem("id");
		
			$http({
				method : 'post',
				url : 'php/event_collection.php',
				data : {'b_selected' : $scope.b_selected, 'id' : $scope.id, 'ref' : 3}
			}).then(function(response)
			{
				$scope.eventCollection_details = response.data.eventCollection_details;
				
				$scope.amount = $scope.eventCollection_details[0]['amt'];
				$scope.date = $scope.eventCollection_details[0]['date'];
				$scope.eventName = $scope.eventCollection_details[0]['eventName'];
				
				$scope.m_details = [{'name': "", 'roomNo': "", 'id': ""}];
				
				$scope.m_details[0]['name'] = $scope.eventCollection_details[0]['name'];
				$scope.m_details[0]['roomNo'] = $scope.eventCollection_details[0]['roomNo'];
				$scope.m_details[0]['id'] = $scope.eventCollection_details[0]['memberId'];
				
				$scope.memberId = $scope.eventCollection_details[0]['memberId'];
			});
		}
	}
	
	$scope.submit_data = function()
	{
		if(!$scope.memberId)
		{
			$scope.message2 = "*Please select a member";
			document.getElementById("nik-required2").style.display = "block";
		}
		else
		{
			if($scope.update==1)
			{
				$scope.id = sessionStorage.getItem("id");
				
				$http({
					method : 'post',
					url : 'php/event_collection.php',
					data : {'memberId': $scope.memberId, 'b_selected' : $scope.b_selected, 
							'update' : $scope.update, 'ref' : 2,
							'amount' : $scope.amount, 'date' : $scope.date, 'eventName' : $scope.eventName,
							'id' : $scope.id}
				}).then(function(response)
				{
					checkResponse = response.data;
					check_status();
				});
			}
			else
			{
					$http({
						method : 'post',
						url : 'php/event_collection.php',
						data : {'memberId': $scope.memberId, 'b_selected' : $scope.b_selected, 
							'update' : $scope.update, 'ref' : 2,
							'amount' : $scope.amount, 'date' : $scope.date, 'eventName' : $scope.eventName}
					}).then(function(response)
					{
						checkResponse = response.data;
						check_status();
					});
			}
		}
	}
	
	$scope.eventCollection_det = function(id)
	{
		sessionStorage.setItem("id",id);
		window.open("event_collection_update.html","_self");
	}
	
	$scope.ec_update = function()
	{
		$scope.id = sessionStorage.getItem("id");
		
		$http({
				method : 'post',
				url : 'php/event_collection.php',
				data : {'b_selected' : $scope.b_selected, 'id' : $scope.id, 'ref' : 3}
			}).then(function(response)
			{
				$scope.eventCollection_details = response.data.eventCollection_details;
				
				console.log($scope.eventCollection_details);
			});
	}
	
	$scope.eventCollection_update = function()
	{
		sessionStorage.setItem("update",1);
		window.open("event_collection_add.html","_self");
	}
	
	$scope.eventCollection_delete = function()
	{
		$http({
				method : 'post',
				url : 'php/event_collection.php',
				data : {'b_selected' : $scope.b_selected, 'id' : $scope.id, 'ref' : 4}
			}).then(function(response)
			{
				checkResponse = response.data;
				check_status();
				window.open("event_collection.html","_self")
			});
	}
	
});



