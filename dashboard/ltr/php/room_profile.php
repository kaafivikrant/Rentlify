<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$roomId = $request->roomId;
	
	function test_input($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
		}
		
	if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
     }
	
	$data = array();
	
	$data['m_details'] = null;
	
	$sql = $conn->prepare("SELECT * FROM flatnroom_details WHERE id = ?");
	$sql->bind_param("i",$roomId);
	
	$sql->execute();
	$result = $sql->get_result();
	
	while($row = $result->fetch_assoc())
	{
		$data['m_details'] = $row;
	}
	
	echo json_encode($data);
	
?>