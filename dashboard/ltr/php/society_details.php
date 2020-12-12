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
	
		$data['rules'] = null;
		$data['facilities'] = null;
		$data['faq'] = null;
		$data['docs'] = null;
		
		$sql1 = $conn->prepare("SELECT * FROM society_rules WHERE bId = ?");
		$sql1->bind_param("i",$b_selected);
		
		$sql2 = $conn->prepare("SELECT * FROM manage_facilities WHERE bId = ?");
		$sql2->bind_param("i",$b_selected);
		
		$sql3 = $conn->prepare("SELECT * FROM faq WHERE bId = ?");
		$sql3->bind_param("i",$b_selected);
		
		$sql4 = $conn->prepare("SELECT * FROM building_docs WHERE bId = ?");
		$sql4->bind_param("i",$b_selected);
		
		$sql1->execute();
		$result1 = $sql1->get_result();
		
		$sql2->execute();
		$result2 = $sql2->get_result();
		
		$sql3->execute();
		$result3 = $sql3->get_result();
		
		$sql4->execute();
		$result4 = $sql4->get_result();
		
		while($row1 = $result1->fetch_assoc())
		{
			$data['rules'][] = $row1;
		}
		
		while($row2 = $result2->fetch_assoc())
		{
			$data['facilities'][] = $row2;
		}
		
		while($row3 = $result3->fetch_assoc())
		{
			$data['faq'][] = $row3;
		}
		
		while($row4 = $result4->fetch_assoc())
		{
			$data['docs'][] = $row4;
		}
		
		echo json_encode($data);
	}
	else if($ref==2)
	{
		$rule = test_input($request->rule);
		
		$sql = $conn->prepare("INSERT INTO society_rules(bId, rule) VALUES(?,?)");
		$sql->bind_param("is",$b_selected, $rule);
		
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
	else if($ref==3)
	{
		$id = test_input($request->id);
		
		$sql = $conn->prepare("DELETE FROM society_rules WHERE id = ?");
		$sql->bind_param("i",$id);
		
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
		$rules = $request->rules;
		
		for($i=0;$i<count($rules);$i++)
		{
			$sql = $conn->prepare("UPDATE society_rules SET rule = ? WHERE id = ?");
			$sql->bind_param("si", $rules[$i]->rule, $rules[$i]->id);
			
			if($sql->execute())
			{
				$data = 1;
			}
			else
			{
				$data = 0;
			}
		}
		
		echo $data;
	}
	else if($ref==5)
	{
		$facility = test_input($request->facility);
		
		$sql = $conn->prepare("INSERT INTO manage_facilities(bId, facility) VALUES(?,?)");
		$sql->bind_param("is",$b_selected, $facility);
		
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
	else if($ref==6)
	{
		$id = test_input($request->id);
		
		$sql = $conn->prepare("DELETE FROM manage_facilities WHERE id = ?");
		$sql->bind_param("i",$id);
		
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
	else if($ref==7)
	{
		$data = array();
	
		$data['facilities'] = null;
		
		$sql1 = $conn->prepare("SELECT * FROM manage_facilities WHERE bId = ?");
		$sql1->bind_param("i",$b_selected);
		
		$sql1->execute();
		$result1 = $sql1->get_result();
		
		while($row1 = $result1->fetch_assoc())
		{
			$data['facilities'][] = $row1;
		}
		
		echo json_encode($data);
	}
	else if($ref==8)
	{
		$facilities = $request->facilities;
		
		for($i=0;$i<count($facilities);$i++)
		{
			$sql = $conn->prepare("UPDATE manage_facilities SET facility = ? WHERE id = ?");
			$sql->bind_param("si", $facilities[$i]->facility, $facilities[$i]->id);
			
			if($sql->execute())
			{
				$data = 1;
			}
			else
			{
				$data = 0;
			}
		}
		
		echo $data;
	}
	else if($ref==9)
	{
		$question = test_input($request->question);
		$answer = test_input($request->answer);
		
		$sql = $conn->prepare("INSERT INTO faq(bId, question, answer) VALUES(?,?,?)");
		$sql->bind_param("iss",$b_selected, $question, $answer);
		
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
	else if($ref==10)
	{
		$id = test_input($request->id);
		
		$sql = $conn->prepare("DELETE FROM faq WHERE id = ?");
		$sql->bind_param("i",$id);
		
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
	else if($ref==11)
	{
		$data = array();
	
		$data['faq'] = null;
		
		$sql1 = $conn->prepare("SELECT * FROM faq WHERE bId = ?");
		$sql1->bind_param("i",$b_selected);
		
		$sql1->execute();
		$result1 = $sql1->get_result();
		
		while($row1 = $result1->fetch_assoc())
		{
			$data['faq'][] = $row1;
		}
		
		echo json_encode($data);
	}
	else if($ref==12)
	{
		$faq = $request->faq;
		
		for($i=0;$i<count($faq);$i++)
		{
			$sql = $conn->prepare("UPDATE faq SET question = ?, answer = ? WHERE id = ?");
			$sql->bind_param("ssi", $faq[$i]->question, $faq[$i]->answer, $faq[$i]->id);
			
			if($sql->execute())
			{
				$data = 1;
			}
			else
			{
				$data = 0;
			}
		}
		
		echo $data;
	}
	else if($ref==13)
	{
		$data = array();
	
		$data['doc'] = null;
		
		$sql1 = $conn->prepare("SELECT * FROM building_docs WHERE bId = ?");
		$sql1->bind_param("i",$b_selected);
		
		$sql1->execute();
		$result1 = $sql1->get_result();
		
		while($row1 = $result1->fetch_assoc())
		{
			$data['doc'][] = $row1;
		}
		
		echo json_encode($data);
	}
	else if($ref==14)
	{
		$id = test_input($request->id);
		
		$sql = $conn->prepare("DELETE FROM building_docs WHERE id = ?");
		$sql->bind_param("i",$id);
		
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
	
?>