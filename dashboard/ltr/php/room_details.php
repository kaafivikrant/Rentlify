<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$b_selected = $request->b_selected;
	$roomNo = test_input($request->roomNo);
	$isRented = test_input($request->isRented);
	$rentAmt = test_input($request->rentAmt);
	$roomType = test_input($request->roomType);
	$maxMemberAllowed = test_input($request->maxMemberAllowed);
	$noOfMember = test_input($request->noOfMember);
	$deposit = test_input($request->deposit);
	$genderStay = test_input($request->genderStay);
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
		$roomId = $request->roomId;
		
		$sql = $conn->prepare("UPDATE flatnroom_details SET roomNo = ?, 
		isRented = ?, rentAmt = ?, roomType = ?, maxMemberAllowed = ?, noOfMember = ?, 
		deposit = ?, genderStay = ? WHERE id = ?");
		$sql->bind_param("siiiiiiii", $roomNo, $isRented, $rentAmt, $roomType,
		$maxMemberAllowed, $noOfMember, $deposit, $genderStay, $roomId);
	}
	else
	{
		$sql = $conn->prepare("INSERT INTO flatnroom_details(bId, roomNo, isRented, rentAmt, roomType,
		maxMemberAllowed, noOfMember, deposit, genderStay) VALUES (?,?,?,?,?,?,?,?,?)");
		$sql->bind_param("isiiiiiii", $b_selected, $roomNo, $isRented, $rentAmt, $roomType,
		$maxMemberAllowed, $noOfMember, $deposit, $genderStay);
	}
	
	if ($sql->execute() === TRUE) {
        echo "1";

     } else {
        echo "0";
	}
?>