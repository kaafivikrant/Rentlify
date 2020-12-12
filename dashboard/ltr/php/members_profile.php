<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$memberId = $request->memberId;
	
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
	
	$sql = $conn->prepare("SELECT rent_maintenance.rentAmt, rent_maintenance.depositAmt,
	members.id ,members.name ,members.bId ,members.contact ,members.email ,members.	dob ,
	members.roomNo ,members.type ,members.totMembers ,members.username ,members.password ,
	members.perAddress , members.dateOfStay
	FROM members INNER JOIN rent_maintenance ON members.id = rent_maintenance.memberId 
	WHERE members.id = ?");
	$sql->bind_param("i",$memberId);
	
	$sql->execute();
	$result = $sql->get_result();
	
	while($row = $result->fetch_assoc())
	{
		$originalDate = $row['dob'];
		$row['dob'] = date("d-m-Y", strtotime($originalDate));
		
		$originalDate = $row['dateOfStay'];
		$row['dateOfStay'] = date("d-m-Y", strtotime($originalDate));
		
		$data['m_details'] = $row;
	}
	
	echo json_encode($data);
	
?>