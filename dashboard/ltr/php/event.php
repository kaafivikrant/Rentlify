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
		$data = array();
	
		$data['options'] = null;
		
		$sql = $conn->prepare("SELECT * FROM manage_facilities WHERE bId = ?");
		$sql->bind_param("i",$b_selected);
		
		$sql->execute();
		$result = $sql->get_result();
		
		while($row = $result->fetch_assoc())
		{
			$data['options'][] = $row;
		}
		
		echo json_encode($data);
	}
	else if($ref==2)
	{
		$org_date = date("Y-m-d",strtotime($request->org_date));
		$facility = $request->facility;
		
		$data = array();
	
		$data['evt_booked'] = null;
		
		$sql = $conn->prepare("SELECT events.bId, events.memberId, events.purpose, events.date,
						manage_facilities.id, manage_facilities.facility,
						members.name, members.roomNo
						FROM events INNER JOIN manage_facilities 
						ON events.facilityId = manage_facilities.id
						INNER JOIN members ON events.memberId = members.id
						WHERE events.bId = ? 
						AND events.date = ? AND manage_facilities.facility = ?");
		$sql->bind_param("iss",$b_selected, $org_date, $facility);
		
		$sql->execute();
		$result = $sql->get_result();
		
		while($row = $result->fetch_assoc())
		{
			$data['evt_booked'][] = $row;
		}
		
		echo json_encode($data);
	}
	else if($ref==3)
	{
		$org_date = date("Y-m-d",strtotime($request->org_date));
		$facilityId = $request->facilityId;
		$memberId = $request->memberId;
		$purpose = $request->purpose;
		
		$sql = $conn->prepare("INSERT INTO events(bId, memberId, purpose, date, facilityId) 
							VALUES (?,?,?,?,?)");
		$sql->bind_param("iissi",$b_selected, $memberId, $purpose, $org_date, $facilityId);
		
		if($sql->execute())
		{
			$data = 1;
		}
		else
		{
			$data = 0;
		}
		
		echo $data;
	}
	else if($ref==4)
	{
		$hst_date = date("Y-m-d",strtotime($request->hst_date));
		
		$data = array();
	
		$data['past_events'] = null;
		
		$sql = $conn->prepare("SELECT events.bId, events.memberId, events.purpose, events.date,
						manage_facilities.id, manage_facilities.facility,
						members.name, members.roomNo
						FROM events INNER JOIN manage_facilities 
						ON events.facilityId = manage_facilities.id
						INNER JOIN members ON events.memberId = members.id
						WHERE events.bId = ? 
						AND events.date = ?");
		$sql->bind_param("is",$b_selected, $hst_date);
		
		$sql->execute();
		$result = $sql->get_result();
		
		while($row = $result->fetch_assoc())
		{
			$data['past_events'][] = $row;
		}
		
		echo json_encode($data);
	}
	
?>