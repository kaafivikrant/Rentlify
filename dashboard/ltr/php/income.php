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
	
		$data['income_details'] = null;
		$data['total'] = null;
		
		$sql = $conn->prepare("SELECT * FROM income WHERE bId = ?");
		$sql->bind_param("i", $b_selected);
		
		$sql->execute();
		$result = $sql->get_result();
		
		while($row = $result->fetch_assoc())
		{
			$row['date'] = date("d-m-Y",strtotime($row['date']));
			
			$data['income_details'][] = $row;
		}
		
		$sql2 = $conn->prepare("SELECT sum(amt) as tot FROM income WHERE bId = ?");
		$sql2->bind_param("i", $b_selected);
		
		$sql2->execute();
		$result2 = $sql2->get_result();
		
		while($row2 = $result2->fetch_assoc())
		{
			$in_tot = $row2['tot'];
		}
		
		$sql3 = $conn->prepare("SELECT sum(amt) as tot FROM expense WHERE bId = ?");
		$sql3->bind_param("i", $b_selected);
		
		$sql3->execute();
		$result3 = $sql3->get_result();
		
		while($row3 = $result3->fetch_assoc())
		{
			$ex_tot = $row3['tot'];
		}
		
		$sql4 = $conn->prepare("SELECT sum(amt) as tot FROM fine_collection 
		INNER JOIN members ON fine_collection.memberId = members.id WHERE members.bId = ?");
		$sql4->bind_param("i", $b_selected);
		
		$sql4->execute();
		$result4 = $sql4->get_result();
		
		while($row4 = $result4->fetch_assoc())
		{
			$fc_tot = $row4['tot'];
		}
		
		$sql5 = $conn->prepare("SELECT sum(amt) as tot FROM event_collection 
		INNER JOIN members ON event_collection.memberId = members.id WHERE members.bId = ?");
		$sql5->bind_param("i", $b_selected);
		
		$sql5->execute();
		$result5 = $sql5->get_result();
		
		while($row5 = $result5->fetch_assoc())
		{
			$ec_tot = $row5['tot'];
		}
		
		$data['total'] = ($in_tot + $fc_tot + $ec_tot) - $ex_tot;
		
		echo json_encode($data);
	}
	else if($ref==2)
	{
		$update = $request->update;
		$amount = $request->amount;
		$date = date("Y-m-d", strtotime($request->date));
		$note = $request->note;
	
		if($update==0)
		{
			$sql = $conn->prepare("INSERT INTO income(note, amt, date, bId) 
			VALUES (?,?,?,?)");
			$sql->bind_param("sisi", $note, $amount, $date, $b_selected);
		}
		else
		{
			$id = $request->id;
			
			$sql = $conn->prepare("UPDATE income SET 
			note = ?, amt = ?, date = ?, bId = ? WHERE id = ?");
			$sql->bind_param("sisii", $note, $amount, $date, $b_selected, $id);
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
	
		$data['income_details'] = null;
		
		$sql = $conn->prepare("SELECT * FROM income WHERE bId = ? AND id = ?");
		$sql->bind_param("ii", $b_selected, $id);
		
		$sql->execute();
		$result = $sql->get_result();
		
		while($row = $result->fetch_assoc())
		{
			$row['date'] = date("d-m-Y",strtotime($row['date']));
			
			$data['income_details'][] = $row;
		}
		
		echo json_encode($data);
	}
	else if($ref==4)
	{
		$id = $request->id;
		
		$sql = $conn->prepare("DELETE FROM income WHERE id = ?");
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
	
?>