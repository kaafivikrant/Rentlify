<?php

	include_once "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$b_selected = $request->b_selected;
	$ref = $request->ref;
	
	$ppu = 10;
	
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
		$amount = $request->amount;
		$year = $request->year;
		$month = $request->month;
		$memberId = $request->memberId;
		$date = date("Y-m-d",strtotime($request->date));
		
		$tmpMonth = date("m",strtotime($month));
		
		$billId = $year.$tmpMonth.$memberId;
		
		$sql = $conn->prepare("INSERT INTO monthly_lightbill(month, year, paidAmt, dateOfPay, memberId, billId) VALUES(?,?,?,?,?,?)");
		$sql->bind_param("siisii", $month, $year, $amount, $date, $memberId, $billId);
		
		if ($sql->execute() === TRUE) {
			 echo "1";

		 } else {
			echo "0";
		 }
	}
	else if($ref==2)
	{
		$search_slt = $request->search_slt;
		$choice = $request->choice;
		
		$data = array();
	
		$data['bill_details'] = null;
		$data['count'] = null;
		
		if($choice==1)
		{
			if(!strcmp($search_slt,"All"))
			{
				$sql2 = $conn->prepare("SELECT MAX(monthly_lightbill.billId) as billId, members.bId, 
				members.name, members.roomNo
				FROM monthly_lightbill
				INNER JOIN members on monthly_lightbill.memberId = members.id 
				GROUP by monthly_lightbill.memberId HAVING bId = ?");
				$sql2->bind_param("i",$b_selected);
			}
			else if(!strcmp($search_slt,"Name"))
			{
				$name = test_input($request->name);
				$name = "%".$name."%";
				
				$sql2 = $conn->prepare("SELECT MAX(monthly_lightbill.billId) as billId, members.bId, 
				members.name, members.roomNo
				FROM monthly_lightbill
				INNER JOIN members on monthly_lightbill.memberId = members.id 
				GROUP by monthly_lightbill.memberId HAVING bId = ? AND name LIKE ?");
				$sql2->bind_param("is", $b_selected, $name);
			}
			else
			{
				$name = test_input($request->name);
				$name = "%".$name."%";
				
				$sql2 = $conn->prepare("SELECT MAX(monthly_lightbill.billId) as billId, members.bId, 
				members.name, members.roomNo
				FROM monthly_lightbill
				INNER JOIN members on monthly_lightbill.memberId = members.id 
				GROUP by monthly_lightbill.memberId HAVING bId = ? AND roomNo LIKE ?");
				$sql2->bind_param("is", $b_selected, $name);
			}
			
			$sql2->execute();
			$result2 = $sql2->get_result();
			
			$i = 0;
			
			while($row2 = $result2->fetch_assoc())
			{
				$sql = $conn->prepare("SELECT SUM(monthly_lightbill.paidAmt) as tot , members.bId,
				members.dateOfStay,monthly_lightbill.month, monthly_lightbill.year, monthly_lightbill.billId,
				monthly_lightbill.memberId, light_bill.units, members.name
				FROM monthly_lightbill inner JOIN light_bill
				on monthly_lightbill.billId = light_bill.billId 
				INNER JOIN members on monthly_lightbill.memberId = members.id 
				GROUP by monthly_lightbill.billId HAVING  tot <= (units * ?)
				AND bId = ? AND monthly_lightbill.billId = ?");
				$sql->bind_param("iii", $ppu, $b_selected, $row2['billId']);
				
				$sql->execute();
				$result = $sql->get_result();
			
				$tot_bill = 0;
			
				while($row = $result->fetch_assoc())
				{
					$tot_bill = $tot_bill + (($row['units'] * $ppu) - $row['tot']);
					
					$date2 = $row['month']." ".$row['year'];
					$date1 = $row['dateOfStay'];
					$currentDate = date('Y-m-d');

					$ts1 = strtotime($date2);
					$ts2 = strtotime($currentDate);

					$year1 = date('Y', $ts1);
					$year2 = date('Y', $ts2);

					$month1 = date('m', $ts1);
					$month2 = date('m', $ts2);
					
					$day3 = date('d', $ts1);
					$day4 = date('d', $ts2);

					$diff = (($year2 - $year1) * 12) + ($month2 - $month1) - 1;
					
					$sql3 = $conn->prepare("SELECT light_bill.units, light_bill.month
								FROM light_bill
								WHERE memberId = ? AND billId > ?");
					$sql3->bind_param("ii", $row['memberId'], $row['billId']);
					
					$sql3->execute();
					$result3 = $sql3->get_result();
					
					$tmpRow3 = array();
					
					while($row3 = $result3->fetch_assoc())
					{
						$tmpRow3[] = $row3; 
						//echo json_encode($row3);
					}
					
					for($i=0;$i<count($tmpRow3);$i++)
					{
						$tot_bill = $tot_bill + ($tmpRow3[$i]['units'] * $ppu);
					}
					
					if($tot_bill!=0)
					{
						$row['pending_bill'] = $tot_bill;
						
						$i++;
						$data['bill_details'][] = $row;
					}
				}
			}
			
			$data['count'] = $i;
			
			echo json_encode($data);
		}
		else if($choice==2)
		{
			if(!strcmp($search_slt,"All"))
			{
				$sql = $conn->prepare("SELECT * FROM members WHERE bId = ?");
				$sql->bind_param("i",$b_selected);
			}
			else if(!strcmp($search_slt,"Name"))
			{
				$name = test_input($request->name);
				$name = "%".$name."%";
				$sql = $conn->prepare("SELECT * FROM members
				WHERE bId = ? AND name LIKE ?");
				$sql->bind_param("is", $b_selected, $name);
			}
			else
			{
				$name = test_input($request->name);
				$name = "%".$name."%";
				$sql = $conn->prepare("SELECT * FROM members
				WHERE bId = ? AND roomNo LIKE ?");
				$sql->bind_param("is", $b_selected, $name);
			}
			
			$sql->execute();
			$result = $sql->get_result();
			
			$i = 0;
			while($row = $result->fetch_assoc())
			{
				$i++;
				$data['bill_details'][] = $row;
			}
			
			$data['count'] = $i;
			
			echo json_encode($data);
		}
		
	}
	else if($ref==3)
	{	
		$memberId = $request->memberId;

		$data = array();
		$tmpData = array();
	
		$data['bill_details'] = null;
		$tmpData= null;
	
		$sql2 = $conn->prepare("SELECT MAX(monthly_lightbill.billId) as billId, members.bId, 
				members.name, members.roomNo
				FROM monthly_lightbill
				INNER JOIN members on monthly_lightbill.memberId = members.id 
				GROUP by monthly_lightbill.memberId HAVING bId = ? AND monthly_lightbill.memberId = ?");
		$sql2->bind_param("ii",	$b_selected, $memberId);
		
		$sql2->execute();
		$result2 = $sql2->get_result();
		
			while($row2 = $result2->fetch_assoc())
			{
				$sql = $conn->prepare("SELECT SUM(monthly_lightbill.paidAmt) as tot , members.bId,
				members.dateOfStay,monthly_lightbill.month, monthly_lightbill.year, monthly_lightbill.billId,
				monthly_lightbill.memberId, light_bill.units, members.name, members.roomNo, members.contact
				FROM monthly_lightbill inner JOIN light_bill
				on monthly_lightbill.billId = light_bill.billId 
				INNER JOIN members on monthly_lightbill.memberId = members.id 
				GROUP by monthly_lightbill.billId HAVING  tot <= (units * ?)
				AND bId = ? AND monthly_lightbill.billId = ?");
				$sql->bind_param("iii", $ppu, $b_selected, $row2['billId']);
				
				$sql->execute();
				$result = $sql->get_result();
			
				$tot_bill = 0;
			
				while($row = $result->fetch_assoc())
				{
					$tot_bill = $tot_bill + (($row['units'] * $ppu) - $row['tot']);
					
					$billPending = ($row['units'] * $ppu) - $row['tot'];
					
					$bill_d = new stdClass();
					$bill_d->month = $row['month'];
					$bill_d->amt = $billPending;
					$bill_d->units = $row['units'];
					
					if($bill_d->amt!=0)
					{
						$row['bill_d'][] = $bill_d;
					}
					
					$date2 = $row['month']." ".$row['year'];
					$date1 = $row['dateOfStay'];
					$currentDate = date('Y-m-d');

					$ts1 = strtotime($date2);
					$ts2 = strtotime($currentDate);

					$year1 = date('Y', $ts1);
					$year2 = date('Y', $ts2);

					$month1 = date('m', $ts1);
					$month2 = date('m', $ts2);
					
					$day3 = date('d', $ts1);
					$day4 = date('d', $ts2);

					$diff = (($year2 - $year1) * 12) + ($month2 - $month1) - 1;
					
					$sql3 = $conn->prepare("SELECT light_bill.units, light_bill.month
								FROM light_bill
								WHERE memberId = ? AND billId > ?");
					$sql3->bind_param("ii", $row['memberId'], $row['billId']);
					
					$sql3->execute();
					$result3 = $sql3->get_result();
					
					while($row3 = $result3->fetch_assoc())
					{
						$bill_d = new stdClass();
						$bill_d->month = $row3['month'];
						$bill_d->units = $row3['units'];
						$bill_d->amt = $row3['units'] * $ppu;
						
						$row['bill_d'][] = $bill_d;
						$tmpRow3[] = $row3; 
					}
					
					for($i=0;$i<count($tmpRow3);$i++)
					{
						$tot_bill = $tot_bill + ($tmpRow3[$i]['units'] * $ppu);
					}
					
					if($tot_bill!=0)
					{
						$row['pending_bill'] = $tot_bill;
						$data['bill_details'][] = $row;
					}
				}
			}
			
		echo json_encode($data);
	}
	else if($ref==4)
	{
		$memberId = $request->memberId;
		
		$data = array();
	
		$data['bill_details'] = null;
		$data['member'] = null;
		
		$sql1 = $conn->prepare("SELECT * FROM monthly_lightbill WHERE memberId = ?");
		$sql1->bind_param("i",$memberId);
		
		$sql1->execute();
		$result1 = $sql1->get_result();
		
		while($row1 = $result1->fetch_assoc())
		{	
				$row1['dateOfPay'] = date("d-m-Y", strtotime($row1['dateOfPay']));
	
				$data['bill_details'][] = $row1;
		}
		
		$sql2 = $conn->prepare("SELECT * FROM members WHERE id = ?");
		$sql2->bind_param("i",$memberId);
		
		$sql2->execute();
		$result2 = $sql2->get_result();
		
		while($row2 = $result2->fetch_assoc())
		{	
				$data['member'][] = $row2;
		}
		
		echo json_encode($data);
	}
	else if($ref==5)
	{
		$id = $request->id;
		
		$sql = $conn->prepare("DELETE FROM monthly_lightbill WHERE id = ?");
		$sql->bind_param("i",$id);
		
		if ($sql->execute() === TRUE) 
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
		$bill_details = $request->bill_details;
		$member = $request->member;
		
		for($i=0;$i<count($bill_details);$i++)
		{
			$tmpMonth = date("m",strtotime($bill_details[$i]->month));
		
			$billId = $bill_details[$i]->year.$tmpMonth.$member[0]->id;
			
			$date = date("Y-m-d",strtotime($bill_details[$i]->dateOfPay));
		
			$sql1 = $conn->prepare("UPDATE monthly_lightbill SET month = ?,
			year = ?, paidAmt = ?, dateOfPay = ?, billId = ?  WHERE id = ?");
			$sql1->bind_param("siisii", $bill_details[$i]->month, $bill_details[$i]->year,
							$bill_details[$i]->paidAmt, $date, $billId, $bill_details[$i]->id);
							
			if ($sql1->execute() === TRUE) 
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
	else if($ref==7)
	{
		$units = $request->units;
		$year = $request->year;
		$month = $request->month;
		$memberId = $request->memberId;
		
		$sql = $conn->prepare("INSERT INTO light_bill(month, year, memberId, units) VALUES(?,?,?,?)");
		$sql->bind_param("siii", $month, $year, $memberId, $units);
		
		if ($sql->execute() === TRUE) {
			 echo "1";

		 } else {
			echo "0";
		 }
	}
?>