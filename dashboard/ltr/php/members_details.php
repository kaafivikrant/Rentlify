<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$b_selected = $request->b_selected;
	$mname = test_input($request->mname);
	$contact = test_input($request->contact);
	$email = test_input($request->email);
	$dob = test_input($request->dob);
	$roomNo = test_input($request->roomNo);
	$address = test_input($request->address);
	$tot_mem = test_input($request->tot_mem);
	$doc = test_input($request->doc);
	$mtype = $request->mtype;
	$flag = $request->flag;
	$rent = $request->rent;
	$deposit = $request->deposit;
	
	$sql_fg = 0;
	
	$dob = date("Y-m-d", strtotime($dob));
	$doc = date("Y-m-d", strtotime($doc));
	
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
		
		$sql = $conn->prepare("UPDATE members SET name = ?, 
		contact = ?, email = ?, dob = ?, roomNo = ?, type = ?, totMembers = ?, perAddress = ?,
		dateOfStay = ? WHERE id = ?");
		$sql->bind_param("sisssiissi", $mname, $contact, $email, $dob, $roomNo, 
		$mtype, $tot_mem, $address, $doc, $memberId);
		
		$sql2 = $conn->prepare("UPDATE rent_maintenance SET
		rentAmt = ?, depositAmt = ? WHERE memberId = ?");
		$sql2->bind_param("iii", $rent, $deposit, $memberId);
		
		if($sql->execute())
		{
			$sql_fg = 1;
		}
	}
	else
	{
		$sql = $conn->prepare("INSERT INTO members (name, bId, 
		contact, email, dob, roomNo, type, totMembers, perAddress,
		dateOfStay) VALUES (?,?,?,?,?,?,?,?,?,?)");
		$sql->bind_param("siisssiiss", $mname, $b_selected, $contact, $email, $dob, $roomNo, 
		$mtype, $tot_mem, $address, $doc);
		
		if($sql->execute())
		{
			$sql_fg = 1;
		}
		
		$memberId = $sql->insert_id;
		
		$sql2 = $conn->prepare("INSERT INTO rent_maintenance (memberId, rentAmt, depositAmt)
		VALUES (?,?,?)");
		$sql2->bind_param("iii", $memberId, $rent, $deposit);
	}
	
	if ($sql_fg && $sql2->execute() === TRUE) {
         echo "1";

     } else {
        echo "0";
     }
?>