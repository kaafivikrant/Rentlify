<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$memberId = $request->memberId;
	$ref = $request->ref;
	
	function test_input($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
		}	
		
		if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
     }
		
		if($ref==1)
		{
			$data = array();
		
			$data['c_details'] = null;
			
			$sql = $conn->prepare("SELECT * FROM complain WHERE memberId = ?");
			$sql->bind_param("i",$memberId);
		
			$sql->execute();
			$result = $sql->get_result();
			
			while($row = $result->fetch_assoc())
			{
				$data['c_details'][] = $row;
			}
			
			echo json_encode($data);
		}
		else if($ref==2)
		{
			$complainId = $request->complainId;
			
			$sql = $conn->prepare("DELETE FROM complain WHERE id = ?");
			$sql->bind_param("i",$complainId);
		
			if($sql->execute() === TRUE) {
				 echo "1";

			 } else {
				echo "0";
			 }
		}
		else if($ref==3)
		{
			$complainTxt = $request->complainTxt;
			$status = 2;
			$date = date("Y-m-d");
			
			$sql = $conn->prepare("INSERT INTO complain(memberId, complain, status, date) VALUES (?,?,?,?)");
			$sql->bind_param("isis",$memberId,$complainTxt,$status,$date);
		
			if($sql->execute() === TRUE) {
				 echo "1";

			 } else {
				echo "0";
			 }
		}
	
?>
