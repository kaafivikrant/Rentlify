<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$b_selected = $request->b_selected;
	$mname = test_input($request->mname);
	$contact = test_input($request->contact);
	$service = $request->service;
	$address = test_input($request->address);
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
		
		$sql = $conn->prepare("UPDATE service_contact SET bId = ?, name = ?, service = ?,
		contact = ?, address = ? WHERE id = ?");
		$sql->bind_param("issisi", $b_selected, $mname, $service, $contact, $address, $memberId);
	}
	else
	{
		$sql = $conn->prepare("INSERT INTO service_contact (bId, name, service,
		contact, address) VALUES (?,?,?,?,?)");
		$sql->bind_param("issis", $b_selected, $mname, $service, $contact, $address);
	}
	
	if ($sql->execute() === TRUE) {
         echo "1";

     } else {
        echo "0";
     }
?>