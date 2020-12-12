<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	//$adminId = $request->adminId;
	$mob_num = $request->mob_num;
	
	function test_input($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
		}
	
	$data = array();
	
	$data['b_details'] = null;
	$data['admin_details'] = null;
	
	$sql = $conn->prepare("SELECT building_master.id, building_master.name, building_master.image, building_master.address 
	FROM building_master 
	INNER JOIN admin_master ON admin_master.id = building_master.adminId WHERE admin_master.contact = ?");
	$sql->bind_param("i",$mob_num);
	
	$sql->execute();
	$result = $sql->get_result();
	
	while($row = $result->fetch_assoc())
	{
		$data['b_details'][] = $row;
	}
	
	$sql2 = $conn->prepare("SELECT * FROM admin_master WHERE contact = ?");
	$sql2->bind_param("i", $mob_num);
	
	$sql2->execute();
	$result = $sql2->get_result();
	
	while($row = $result->fetch_assoc())
	{
		$originalDate = $row['dob'];
		$row['dob'] = date("d-m-Y", strtotime($originalDate));
		
		$data['admin_details'] = $row;
	}
	
	echo json_encode($data);
	
?>