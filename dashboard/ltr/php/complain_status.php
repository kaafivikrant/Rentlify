<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$complainId = $request->complainId;
	$status = $request->status;
	
	function test_input($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
		}
		
	if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
     }
	
		$sql = $conn->prepare("UPDATE complain SET status = ? WHERE id = ?");
		$sql->bind_param("ii",$status, $complainId);
	
	if($sql->execute())
	{
		$data = 1;
	}
	else
	{
		$data = 0;
	}
	
	
	echo $data;
	
?>