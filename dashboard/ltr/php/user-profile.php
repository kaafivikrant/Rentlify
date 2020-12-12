<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$mob_num = $request->mob_num;
	
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
		$data['vehicle'] = null;
		$data['memberId'] = null;
		
		$sql3 = $conn->prepare("SELECT * FROM members WHERE contact = ?");
		$sql3->bind_param("i",$mob_num);
	
		$sql3->execute();
		$result3 = $sql3->get_result();
		
		while($row3 = $result3->fetch_assoc())
		{
			$data['memberId'] = $row3['id'];
		}
		
		$sql = $conn->prepare("SELECT members.id,members.name,members.email,
		members.contact,members.roomNo,members.dateOfStay,members.perAddress,
		rent_maintenance.rentAmt,rent_maintenance.depositAmt 
		FROM members INNER JOIN rent_maintenance 
		ON members.id = rent_maintenance.memberId WHERE members.contact = ?");
		$sql->bind_param("i",$mob_num);
	
		$sql->execute();
		$result = $sql->get_result();
		
		while($row = $result->fetch_assoc())
		{
			$data['m_details'][] = $row;
		}
		
		$sql2 = $conn->prepare("SELECT vehicles.id, vehicles.vehicleNo
		FROM vehicles INNER JOIN members ON vehicles.memberId = members.id
		WHERE members.contact=?");
		$sql2->bind_param("i",$mob_num);
		
		$sql2->execute();
		$result2 = $sql2->get_result();
		
		while($row2 = $result2->fetch_assoc())
		{
			$data['vehicle'][] = $row2;
		}
		
		echo json_encode($data);
	
?>
