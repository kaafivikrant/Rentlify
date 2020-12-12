<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$memberId = $request->memberId;
	$vehicleNo = test_input($request->vehicleNo);
	$flag = $request->flag;
	
	function test_input($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
		}
		
	if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
     }
	
	if($flag==1)
	{
		$vehicleId = $request->vehicleId;
		
		$sql = $conn->prepare("UPDATE vehicles SET memberId = ?, vehicleNo = ? WHERE id = ?");
		$sql->bind_param("isi", $memberId, $vehicleNo, $vehicleId);
	}
	else
	{
		$sql = $conn->prepare("INSERT INTO vehicles (memberId, vehicleNo) VALUES (?, ?) ");
		$sql->bind_param("is", $memberId, $vehicleNo);
	}
	
	if ($sql->execute() === TRUE) {
         echo "1";

     } else {
        echo "0";
     }
?>