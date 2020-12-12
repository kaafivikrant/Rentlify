<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$b_selected = $request->b_selected;
	$message = test_input($request->message);
	$ref = $request->ref;
	
	function test_input($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
		}
		
	$date = date('Y-m-d');
	$time = date('H:i:s');
		
	if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
     }
	 
		$sql1 = $conn->prepare("INSERT INTO message(bId, message, date, time) VALUES(?,?,?,?)");
		$sql1->bind_param("isss",$b_selected, $message, $date, $time);
		
		$sql1->execute();
		
		$last_id = $sql1->insert_id;
		
	
	if($ref==1)
	{
		$memberId = -1;
		
		$sql2 = $conn->prepare("INSERT INTO send_to(messageId, memberId) VALUES(?,?)");
		$sql2->bind_param("ii",$last_id, $memberId);
		
		$sql2->execute();
	}
	else
	{
		$members = $request->members;
		
		for($i=0;$i<count($members);$i++)
		{
			$sql2 = $conn->prepare("INSERT INTO send_to(messageId, memberId) VALUES(?,?)");
			$sql2->bind_param("ii",$last_id, $members[$i]);
		
			$sql2->execute();
		}
		
		echo json_encode($members);
	}
?>
