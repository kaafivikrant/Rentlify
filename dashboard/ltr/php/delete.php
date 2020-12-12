<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$pageNo = $request->ref;
	
	function test_input($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
		}
	
	if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
     }
	
	if(!strcmp($pageNo,'1'))
	{
		$b_selected = $request->b_selected;
		
		$sql = $conn->prepare("DELETE FROM building_master WHERE id= ?");
		$sql->bind_param("i",$b_selected);
	}
	else if(!strcmp($pageNo,'2'))
	{
		$memberId = $request->memberId;
		
		$sql = $conn->prepare("DELETE FROM members WHERE id= ?");
		$sql->bind_param("i",$memberId);
	}
	else if(!strcmp($pageNo,'3'))
	{
		$memberId = $request->memberId;
		
		$sql = $conn->prepare("DELETE FROM manage_committee WHERE id= ?");
		$sql->bind_param("i",$memberId);
	}
	else if(!strcmp($pageNo,'5'))
	{
		$memberId = $request->memberId;
		
		$sql = $conn->prepare("DELETE FROM service_contact WHERE id= ?");
		$sql->bind_param("i",$memberId);
	}
	else if(!strcmp($pageNo,'6'))
	{
		$vehicleId = $request->vehicleId;
		
		$sql = $conn->prepare("DELETE FROM vehicles WHERE id= ?");
		$sql->bind_param("i",$vehicleId);
	}
	else if(!strcmp($pageNo,'7'))
	{
		$roomId = $request->roomId;
		
		$sql = $conn->prepare("DELETE FROM flatnroom_details WHERE id= ?");
		$sql->bind_param("i",$roomId);
	}
	
	if($sql->execute() === TRUE) {
         echo "1";

     } else {
        echo "0";
     }
?>
