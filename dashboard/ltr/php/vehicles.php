<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$b_selected = $request->b_selected;
	$search_slt = $request->search_slt;
	
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
	
	$data['v_details'] = null;
	$data['count'] = null;
	
	if(!strcmp($search_slt,"All"))
	{
		$sql = $conn->prepare("SELECT vehicles.id, vehicles.vehicleNo, vehicles.memberId,
		members.name, members.roomNo, members.contact, members.email FROM vehicles INNER JOIN members ON vehicles.memberId = members.id WHERE members.bId = ?");
		$sql->bind_param("i",$b_selected);
	}
	else if(!strcmp($search_slt,"Name"))
	{
		$name = test_input($request->name);
		$name = "%".$name."%";
		$sql = $conn->prepare("SELECT vehicles.id, vehicles.vehicleNo, vehicles.memberId,
		members.name, members.roomNo, members.contact, members.email FROM vehicles INNER JOIN members ON vehicles.memberId = members.id WHERE members.bId = ? AND LOWER(members.name) LIKE LOWER(?)");
		$sql->bind_param("is", $b_selected, $name);
	}
	else
	{
		$name = test_input($request->name);
		$name = "%".$name."%";
		$sql = $conn->prepare("SELECT vehicles.id, vehicles.vehicleNo, vehicles.memberId,
		members.name, members.roomNo, members.contact, members.email FROM vehicles INNER JOIN members ON vehicles.memberId = members.id WHERE members.bId = ? AND LOWER(vehicles.vehicleNo) LIKE LOWER(?)");
		$sql->bind_param("is", $b_selected, $name);
	}
	
	$sql->execute();
	$result = $sql->get_result();
	
	$i = 0;
	while($row = $result->fetch_assoc())
	{
		$i++;
		$data['v_details'][] = $row;
	}
	
	$data['count'] = $i;
	
	echo json_encode($data);
	
?>