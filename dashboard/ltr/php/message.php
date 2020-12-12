<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$b_selected = $request->b_selected;
	
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
	$data['message'] = null;
	$data2 = array();
	$data2['message'] = null;
	$tmpData = array();
	
	$sql1 = $conn->prepare("SELECT * FROM message WHERE bId = ?");
	$sql1->bind_param("i",$b_selected);
	
	$sql1->execute();
	$result1 = $sql1->get_result();
	
	$sql3 = $conn->prepare("SELECT send_to.messageId, send_to.memberId, members.roomNo
						FROM send_to INNER JOIN message
						ON send_to.messageId = message.id INNER JOIN members 
						ON members.id = send_to.memberId
						WHERE message.bId = ?");
	$sql3->bind_param("i",$b_selected);
	
	$sql2 = $conn->prepare("SELECT DISTINCT date from message WHERE bId = ?");
	$sql2->bind_param("i",$b_selected);
	
	$sql2->execute();
	$result2 = $sql2->get_result();
	
	while($row1 = $result1->fetch_assoc())
	{
		$row1['time'] = date("h:i A",strtotime($row1['time']));
		
		$sql3->execute();
		$result3 = $sql3->get_result();
		
		$tmpRoom = array();
		$tmpRoom = null;
		
		while($row3 = $result3->fetch_assoc())
		{
			if($row1['id']==$row3['messageId'])
			{
				$tmpRoom[] = $row3;
			}
		}
		
		$row1['rooms'] = $tmpRoom;
		
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

?>
