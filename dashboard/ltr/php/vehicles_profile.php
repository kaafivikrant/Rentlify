<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$vehicleId = $request->vehicleId;
	
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
	
	$sql = $conn->prepare("SELECT vehicles.id, vehicles.vehicleNo, vehicles.memberId,
		members.name, members.roomNo, members.contact, members.email FROM vehicles INNER JOIN members ON vehicles.memberId = members.id WHERE vehicles.id = ?");
	$sql->bind_param("i",$vehicleId);
	
	$sql->execute();
	$result = $sql->get_result();
	
	while($row = $result->fetch_assoc())
	{
		$data['m_details'] = $row;
	}
	
	echo json_encode($data);
	
?>