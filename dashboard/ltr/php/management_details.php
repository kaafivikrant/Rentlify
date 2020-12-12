<?php

	include_once "config.php";
	
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$b_selected = $request->b_selected;
	$mname = test_input($request->mname);
	$contact = test_input($request->contact);
	$email = test_input($request->email);
	$role = test_input($request->role);
	$isMember = $request->isMember;
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
		$memberId = $request->memberId;
		$roomNo = test_input($request->roomNo);
		$address = test_input($request->address);
		
		$sql = $conn->prepare("UPDATE manage_committee SET name = ?, 
		contact = ?, email = ?, role = ?, isMember = ?, address = ?, roomNo = ? WHERE id = ?");
		$sql->bind_param("sississi", $mname, $contact, $email, $role, $isMember, 
		$address, $roomNo, $memberId);
	}
	else
	{
		if($isMember==1)
		{
			$roomNo = test_input($request->roomNo);
			
			$sql = $conn->prepare("INSERT INTO manage_committee(bId, name, contact, email, role, isMember, roomNo) VALUES (?,?,?,?,?,?,?)");
			$sql->bind_param("isissis", $b_selected, $mname, $contact, $email, $role, $isMember, $roomNo);
		}
		else
		{
			$address = test_input($request->address);
			
			$sql = $conn->prepare("INSERT INTO manage_committee (bId, name, contact, email, role, isMember, address) VALUES (?,?,?,?,?,?,?)");
			$sql->bind_param("isissis", $b_selected, $mname, $contact, $email, $role, $isMember, $address);
		}
	}
	
	if ($sql->execute() === TRUE) {
        echo "1";
     } else {
        echo "0";
     }
?>