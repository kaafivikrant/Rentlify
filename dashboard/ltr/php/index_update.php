<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$adminId = $request->adminId;
	$admin_details = $request->admin_details;
	
	
	function test_input($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
		}
	
	$dob = date("Y-m-d", strtotime($admin_details->dob));
	
	$sql = $conn->prepare("UPDATE admin_master SET name = ? , contact = ? , email = ? , address = ? , dob = ?");
	$sql->bind_param("sisss",$admin_details->name , $admin_details->contact, $admin_details->email,
	$admin_details->address, $dob);
	
	if ($sql->execute() === TRUE) {
         echo "1";
     } else {
        echo "0";
     }
?>