<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$b_selected = $request->b_selected;
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
		$search_slt = $request->search_slt;
		
		$data = array();
	
		$data['eventCollection_details'] = null;
		$data['count'] = null;

		if(!strcmp($search_slt,"All"))
		{
			$sql = $conn->prepare("SELECT event_collection.id,
						event_collection.memberId, event_collection.amt, event_collection.date,
						event_collection.eventName, members.name, members.roomNo
						FROM event_collection INNER JOIN members 
						ON event_collection.memberId = members.id WHERE members.bId = ?");
			$sql->bind_param("i",$b_selected);
		}
		else if(!strcmp($search_slt,"Event"))
		{
			$name = test_input($request->name);
			$name = "%".$name."%";
			$sql = $conn->prepare("SELECT event_collection.id,
						event_collection.memberId, event_collection.amt, event_collection.date,
						event_collection.eventName, members.name, members.roomNo
						FROM event_collection INNER JOIN members 
						ON event_collection.memberId = members.id WHERE members.bId = ?
						AND event_collection.eventName LIKE ?");
			$sql->bind_param("is", $b_selected, $name);
		}
		
		$sql->execute();
		$result = $sql->get_result();
		
		$i = 0;
		while($row = $result->fetch_assoc())
		{
			$i++;
			
			$row['date'] = date("d-m-Y", strtotime($row['date']));
			
			$data['eventCollection_details'][] = $row;
		}
		
		$data['count'] = $i;
		
		echo json_encode($data);
	}
	else if($ref==2)
	{
		$update = $request->update;
		$amount = $request->amount;
		$date = date("Y-m-d", strtotime($request->date));
		$eventName = $request->eventName;
		$memberId = $request->memberId;
	
		if($update==0)
		{
			$sql = $conn->prepare("INSERT INTO event_collection(eventName, amt, date, memberId) 
			VALUES (?,?,?,?)");
			$sql->bind_param("sisi", $eventName, $amount, $date, $memberId);
		}
		else
		{
			$id = $request->id;
			
			$sql = $conn->prepare("UPDATE event_collection SET 
			eventName = ?, amt = ?, date = ?, memberId = ? WHERE id = ?");
			$sql->bind_param("sisii", $eventName, $amount, $date, $memberId, $id);
		}
		
		if($sql->execute()===TRUE)
		{
			$data = 1;
		}
		else
		{
			$data = 0;
		}
		
		echo $data;
	}
	else if($ref==3)
	{
		$id = $request->id;
		
		$data = array();
	
		$data['eventCollection_details'] = null;
		
		$sql = $conn->prepare("SELECT event_collection.id,
						event_collection.memberId, event_collection.amt, event_collection.date,
						event_collection.eventName, members.name, members.roomNo
						FROM event_collection INNER JOIN members 
						ON event_collection.memberId = members.id WHERE members.bId = ?
						AND event_collection.id = ?");
		$sql->bind_param("ii", $b_selected, $id);
		
		$sql->execute();
		$result = $sql->get_result();
		
		while($row = $result->fetch_assoc())
		{
			$row['date'] = date("d-m-Y",strtotime($row['date']));
			
			$data['eventCollection_details'][] = $row;
		}
		
		echo json_encode($data);
	}
	else if($ref==4)
	{
		$id = $request->id;
		
		$sql = $conn->prepare("DELETE FROM event_collection WHERE id = ?");
		$sql->bind_param("i", $id);
		
		if($sql->execute()===TRUE)
		{
			$data = 1;
		}
		else
		{
			$data = 0;
		}
		
		echo $data;
	}
	else if($ref==5)
	{
		$search_slt = $request->search_slt;
		
		$data = array();
		
		$data['m_details'] = null;
		$data['count'] = null;
		
		if(!strcmp($search_slt,"All"))
		{
			$sql = $conn->prepare("SELECT * FROM members WHERE bId = ?");
			$sql->bind_param("i",$b_selected);
		}
		else if(!strcmp($search_slt,"Name"))
		{
			$name = test_input($request->name);
			$name = "%".$name."%";
			$sql = $conn->prepare("SELECT * FROM members WHERE bId = ? AND name LIKE ?");
			$sql->bind_param("is", $b_selected, $name);
		}
		else
		{
			$name = test_input($request->name);
			$name = "%".$name."%";
			$sql = $conn->prepare("SELECT * FROM members WHERE bId = ? AND roomNo LIKE ?");
			$sql->bind_param("is", $b_selected, $name);
		}
		
		$sql->execute();
		$result = $sql->get_result();
		
		$i = 0;
		while($row = $result->fetch_assoc())
		{
			$i++;
			$data['m_details'][] = $row;
		}
		
		$data['count'] = $i;
		
		echo json_encode($data);
	}

?>