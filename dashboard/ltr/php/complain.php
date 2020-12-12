<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$b_selected = $request->b_selected;
	$search_slt = $request->search_slt;
	
	if(isset($request->name))
	{
		$name = test_input($request->name);
		$name = "%".$name."%";
	}
	else
	{
		$name = "";
		$name = "%".$name."%";
	}
	
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
	$data['count'] = null;
	
	if(!strcmp($search_slt,"All"))
	{
		$sql = $conn->prepare("SELECT complain.id, complain.memberId,
		complain.complain, complain.status, complain.date,
		members.name, members.roomNo, members.contact, members.email FROM complain INNER JOIN 
		members ON complain.memberId = members.id WHERE members.bId = ?");
		$sql->bind_param("i",$b_selected);
	}
	else
	{
		if(!strcmp($search_slt,"Solved"))
		{
			$status = 0;
		}
		else if(!strcmp($search_slt,"Progress"))
		{
			$status = 1;
		}
		else if(!strcmp($search_slt,"Unsolved"))
		{
			$status = 2;
		}
		
		$sql = $conn->prepare("SELECT complain.id, complain.memberId,
		complain.complain, complain.status, complain.date,
		members.name, members.roomNo, members.contact, members.email FROM complain INNER JOIN 
		members ON complain.memberId = members.id WHERE members.bId = ? AND complain.status = ?
		AND complain.complain LIKE ?");
		$sql->bind_param("iis", $b_selected, $status, $name);
	}
	
	$sql->execute();
	$result = $sql->get_result();
	
	$i = 0;
	while($row = $result->fetch_assoc())
	{
		$i++;
		$data['c_details'][] = $row;
	}
	
	$data['count'] = $i;
	
	echo json_encode($data);
	
?>