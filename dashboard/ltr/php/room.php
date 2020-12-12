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
	
	$data['m_details'] = null;
	$data['count'] = null;
	
	if(!strcmp($search_slt,"Room No"))
	{
		$name = test_input($request->name);
		$name = "%".$name."%";
		$sql = $conn->prepare("SELECT * FROM flatnroom_details WHERE bId = ? AND roomNo LIKE ?");
		$sql->bind_param("is", $b_selected, $name);
	}
	else
	{
		$sql = $conn->prepare("SELECT * FROM flatnroom_details WHERE bId = ?");
		$sql->bind_param("i",$b_selected);
	}
	
	$sql->execute();
	$result = $sql->get_result();
	
	if(!strcmp($search_slt,"All") || !strcmp($search_slt,"Room No"))
	{
		$i = 0;
		while($row = $result->fetch_assoc())
		{
			$i++;
			$data['m_details'][] = $row;
		}
	}
	else if(!strcmp($search_slt,"Vacant Room"))
	{
		$i = 0;
		while($row = $result->fetch_assoc())
		{
			$diff = $row['maxMemberAllowed'] - $row['noOfMember'];
			
			if($diff>0)
			{
				$i++;
				$data['m_details'][] = $row;
			}
		}
	}
	else if(!strcmp($search_slt,"On Rent"))
	{
		$i = 0;
		while($row = $result->fetch_assoc())
		{
			if(!strcmp($row['isRented'],'1'))
			{
				$i++;
				$data['m_details'][] = $row;
			}
		}
	}
	
	$data['count'] = $i;
	
	echo json_encode($data);
	
?>