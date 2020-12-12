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
	
	$data['visitors_details'] = null;
	$data['count'] = null;
	
	if(!strcmp($search_slt,"All"))
	{
		$sql = $conn->prepare("SELECT * FROM visitors WHERE bId = ?");
		$sql->bind_param("i",$b_selected);
	}
	else if(!strcmp($search_slt,"Date"))
	{
		$date = test_input($request->vdate);
		$date = date("Y-m-d", strtotime($date));
		
		$sql = $conn->prepare("SELECT * FROM visitors WHERE bId = ? AND date = ?");
		$sql->bind_param("is",$b_selected, $date);
	}
	else if(!strcmp($search_slt,"Today"))
	{
		$date = date("Y-m-d");
		
		$sql = $conn->prepare("SELECT * FROM visitors WHERE bId = ? AND date = ?");
		$sql->bind_param("is",$b_selected, $date);
	}
	else if(!strcmp($search_slt,"Yesterday"))
	{
		$date = date("Y-m-d",strtotime("-1 days"));
		
		$sql = $conn->prepare("SELECT * FROM visitors WHERE bId = ? AND date = ?");
		$sql->bind_param("is",$b_selected, $date);
	}
	
	
	$sql->execute();
	$result = $sql->get_result();
	
	$i = 0;
	while($row = $result->fetch_assoc())
	{
		$i++;
		$data['visitors_details'][] = $row;
	}
	
	$data['count'] = $i;
	
	echo json_encode($data);
	
?>