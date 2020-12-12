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
		$data['message'] = null;
		$data2 = array();
		$data2['message'] = null;
		$tmpData = array();
		
		$sql4 = $conn->prepare("SELECT bId FROM members WHERE id = ?;");
		$sql4->bind_param("i",$memberId);
		
		$sql4->execute();
		$result4 = $sql4->get_result();
		
		while($row4 = $result4->fetch_assoc())
		{
			$b_selected = $row4['bId'];
		}
		
		$sql1 = $conn->prepare("SELECT quora.id, quora.bId, 
		quora.memberId, quora.message, quora.date, quora.time, members.name 
		FROM quora INNER JOIN members 
		ON quora.memberId = members.id WHERE quora.bId = ?");
		$sql1->bind_param("i",$b_selected);
		
		$sql1->execute();
		$result1 = $sql1->get_result();
		
		/*
		$sql3 = $conn->prepare("SELECT send_to.messageId, send_to.memberId, members.roomNo
							FROM send_to INNER JOIN message
							ON send_to.messageId = message.id INNER JOIN members 
							ON members.id = send_to.memberId
							WHERE message.bId = ?");
		$sql3->bind_param("i",$b_selected);
		*/
		
		$sql2 = $conn->prepare("SELECT DISTINCT date from quora WHERE bId = ?");
		$sql2->bind_param("i",$b_selected);
		
		$sql2->execute();
		$result2 = $sql2->get_result();
		
		while($row1 = $result1->fetch_assoc())
		{
			$row1['time'] = date("h:i A",strtotime($row1['time']));
			
			//$sql3->execute();
			//$result3 = $sql3->get_result();
			
			//$tmpRoom = array();
			//$tmpRoom = null;
			
			//while($row3 = $result3->fetch_assoc())
			//{
				//if($row1['id']==$row3['messageId'])
				//{
					//$tmpRoom[] = $row3;
				//}
			//}
			
			//$row1['rooms'] = $tmpRoom;
			
			$tmpData[] = $row1;
			
		}
		
			while($row2 = $result2->fetch_assoc())
			{
				for($i=0;$i<count($tmpData);$i++)
				{
					if($tmpData[$i]['date']==$row2['date'])
					{
						$data2['message'][$row2['date']][] = $tmpData[$i];
					}
				}
			}
			
		foreach($data2['message'] as $date => $messageData)
		{  
			$date = date("M d, Y",strtotime($date));
			
			$data['message'][$date] = $messageData;
		}  
		
		echo json_encode($data);
	}
	else if($ref==2)
	{
		$msg = $request->msg;
		
		$date = date('Y-m-d');
		$time = date('H:i:s');
		
		
		$sql4 = $conn->prepare("SELECT bId FROM members WHERE id = ?;");
		$sql4->bind_param("i",$memberId);
		
		$sql4->execute();
		$result4 = $sql4->get_result();
		
		while($row4 = $result4->fetch_assoc())
		{
			$b_selected = $row4['bId'];
		}
		
		$sql = $conn->prepare("INSERT INTO quora(bId, memberId, message, date, time) VALUES (?,?,?,?,?)");
		$sql->bind_param("iisss",$b_selected, $memberId, $msg, $date, $time);
		
		if($sql->execute() === TRUE) {
         echo "1";

		 } else {
			echo "0";
		 }
	}
	
	
?>
