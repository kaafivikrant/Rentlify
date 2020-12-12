<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$complainId = $request->complainId;
	$b_selected = $request->b_selected;
	
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
	
	$data['c_details'] = null;
	
	$sql = $conn->prepare("SELECT complain.id, complain.memberId,
		complain.complain, complain.status, complain.date,
		members.name, members.roomNo, members.contact, members.email FROM complain INNER JOIN 
		members ON complain.memberId = members.id WHERE complain.id = ? AND members.bId = ?");
	$sql->bind_param("ii",$complainId, $b_selected);
	
	$sql->execute();
	$result = $sql->get_result();
	
	while($row = $result->fetch_assoc())
	{
		$data['c_details'] = $row;
	}
	
	echo json_encode($data);
	
?>