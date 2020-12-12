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
		$amount = $request->amount;
		$year = $request->year;
		$month = $request->month;
		$memberId = $request->memberId;
		$date = date("Y-m-d",strtotime($request->date));
		
		$tmpMonth = date("m",strtotime($month));
		
		$rentId = $year.$tmpMonth.$memberId;
		
		$sql = $conn->prepare("INSERT INTO monthly_rent(month, year, paidAmt, dateOfPay, memberId, rentId) VALUES(?,?,?,?,?,?)");
		$sql->bind_param("siisii", $month, $year, $amount, $date, $memberId, $rentId);
		
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
	
		$data['rent_details'] = null;
		$data['count'] = null;
		
		if($choice==1)
		{
			if(!strcmp($search_slt,"All"))
			{
				$sql2 = $conn->prepare("SELECT MAX(monthly_rent.rentId) as rentId, members.bId, 
				members.name, members.roomNo
				FROM monthly_rent inner JOIN rent_maintenance 
				on monthly_rent.memberId = rent_maintenance.memberId  
				INNER JOIN members on monthly_rent.memberId = members.id 
				GROUP by monthly_rent.memberId HAVING bId = ?");
				$sql2->bind_param("i",$b_selected);
			}
			else if(!strcmp($search_slt,"Name"))
			{
				$name = test_input($request->name);
				$name = "%".$name."%";
				
				$sql2 = $conn->prepare("SELECT MAX(monthly_rent.rentId) as rentId, members.bId, 
				members.name, members.roomNo
				FROM monthly_rent inner JOIN rent_maintenance 
				on monthly_rent.memberId = rent_maintenance.memberId  
				INNER JOIN members on monthly_rent.memberId = members.id 
				GROUP by monthly_rent.memberId HAVING bId = ? AND name LIKE ?");
				$sql2->bind_param("is", $b_selected, $name);
			}
			else
			{
				$name = test_input($request->name);
				$name = "%".$name."%";
				
				$sql2 = $conn->prepare("SELECT MAX(monthly_rent.rentId) as rentId, members.bId, 
				members.name, members.roomNo
				FROM monthly_rent inner JOIN rent_maintenance 
				on monthly_rent.memberId = rent_maintenance.memberId  
				INNER JOIN members on monthly_rent.memberId = members.id 
				GROUP by monthly_rent.memberId HAVING bId = ? AND roomNo LIKE ?");
				$sql2->bind_param("is", $b_selected, $name);
			}
			
			$sql2->execute();
			$result2 = $sql2->get_result();
			
			$i = 0;
			while($row2 = $result2->fetch_assoc())
			{
				$sql = $conn->prepare("SELECT SUM(monthly_rent.paidAmt) as tot , members.bId,
				members.dateOfStay,monthly_rent.month, monthly_rent.year, 
				monthly_rent.memberId, rent_maintenance.rentAmt, members.name
				FROM monthly_rent inner JOIN rent_maintenance 
				on monthly_rent.memberId = rent_maintenance.memberId  
				INNER JOIN members on monthly_rent.memberId = members.id 
				GROUP by rentId HAVING tot <= rentAmt AND bId = ? AND rentId = ?");
				$sql->bind_param("ii", $b_selected, $row2['rentId']);
				
				$sql->execute();
				$result = $sql->get_result();
			
				while($row = $result->fetch_assoc())
				{
					
					$date2 = $row['month']." ".$row['year'];
					$date1 = $row['dateOfStay'];
					$currentDate = date('Y-m-d');

					$ts1 = strtotime($date1);
					$ts2 = strtotime($date2);

					$year1 = date('Y', $ts1);
					$year2 = date('Y', $ts2);
					
					$month1 = date('m', $ts1);
					$month2 = date('m', $ts2);

					$day1 = date('d', $ts1);
					$day2 = date('d', $ts2);
					
					$diff1 = (($year2 - $year1) * 12) + ($month2 - $month1);
					
					$ts1 = strtotime($date1);
					$ts2 = strtotime($currentDate);

					$year1 = date('Y', $ts1);
					$year2 = date('Y', $ts2);

					$month1 = date('m', $ts1);
					$month2 = date('m', $ts2);
					
					$day3 = date('d', $ts1);
					$day4 = date('d', $ts2);

					$diff2 = (($year2 - $year1) * 12) + ($month2 - $month1);
					
					$month_diff = $diff2 - $diff1;
					
					if($month_diff!=0 && $day4<$day3)
					{
						$month_diff = $month_diff - 1;
					}
					
					$tot_rent = $row['rentAmt'] * $month_diff;
					
					$row['pending_rent'] = $tot_rent + ($row['rentAmt'] - $row['tot']);
					
					$i++;
					$data['rent_details'][] = $row;
				}
			}
			
			$data['count'] = $i;
			
			echo json_encode($data);
		}
		else if($choice==2)
		{
			if(!strcmp($search_slt,"All"))
			{
				$sql = $conn->prepare("SELECT rent_maintenance.id, rent_maintenance.rentAmt,
				members.name, members.id
				FROM rent_maintenance INNER JOIN members ON members.id = rent_maintenance.memberId
				WHERE members.bId = ?");
				$sql->bind_param("i",$b_selected);
			}
			else if(!strcmp($search_slt,"Name"))
			{
				$name = test_input($request->name);
				$name = "%".$name."%";
				$sql = $conn->prepare("SELECT rent_maintenance.id, rent_maintenance.rentAmt,
				members.name, members.id
				FROM rent_maintenance INNER JOIN members ON members.id = rent_maintenance.memberId
				WHERE members.bId = ? AND members.name LIKE ?");
				$sql->bind_param("is", $b_selected, $name);
			}
			else
			{
				$name = test_input($request->name);
				$name = "%".$name."%";
				$sql = $conn->prepare("SELECT rent_maintenance.id, rent_maintenance.rentAmt,
				members.name, members.id
				FROM rent_maintenance INNER JOIN members ON members.id = rent_maintenance.memberId
				WHERE members.bId = ? AND members.roomNo LIKE ?");
				$sql->bind_param("is", $b_selected, $name);
			}
			
			$sql->execute();
			$result = $sql->get_result();
			
			$i = 0;
			while($row = $result->fetch_assoc())
			{
				$i++;
				$data['rent_details'][] = $row;
			}
			
			$data['count'] = $i;
			
			echo json_encode($data);
		}
		
	}
	else if($ref==3)
	{
		$months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
		
		$memberId = $request->memberId;
		
		$data = array();
		$tmpData = array();
	
		$data['rent_details'] = null;
		$tmpData= null;
		
		$sql2 = $conn->prepare("SELECT MAX(monthly_rent.rentId) as rentId, members.bId, 
				members.name, members.roomNo
				FROM monthly_rent inner JOIN rent_maintenance 
				on monthly_rent.memberId = rent_maintenance.memberId  
				INNER JOIN members on monthly_rent.memberId = members.id 
				GROUP by monthly_rent.memberId HAVING bId = ? AND monthly_rent.memberId = ?");
		$sql2->bind_param("ii", $b_selected, $memberId);
		
		$sql2->execute();
		$result2 = $sql2->get_result();
		
		while($row2 = $result2->fetch_assoc())
		{
			$tmpData[] = $row2;
		}

		
		$sql = $conn->prepare("SELECT SUM(monthly_rent.paidAmt) as tot , members.bId,
				members.dateOfStay,monthly_rent.month, monthly_rent.year, 
				monthly_rent.memberId, rent_maintenance.rentAmt, members.name, members.roomNo, members.contact
				FROM monthly_rent inner JOIN rent_maintenance 
				on monthly_rent.memberId = rent_maintenance.memberId  
				INNER JOIN members on monthly_rent.memberId = members.id 
				GROUP by rentId HAVING tot <= rentAmt AND rentId = ?");
		$sql->bind_param("i",$tmpData[0]['rentId']);
		
		$sql->execute();
		$result = $sql->get_result();
		
		while($row = $result->fetch_assoc())
		{	
				$date2 = $row['month']." ".$row['year'];
				$date1 = $row['dateOfStay'];
				$currentDate = date('Y-m-d');

				$ts1 = strtotime($date1);
				$ts2 = strtotime($date2);

				$year1 = date('Y', $ts1);
				$year2 = date('Y', $ts2);

				$month1 = date('m', $ts1);
				$month2 = date('m', $ts2);

				$day1 = date('d', $ts1);
				$day2 = date('d', $ts2);
				
				$diff1 = (($year2 - $year1) * 12) + ($month2 - $month1);
				
				$ts1 = strtotime($date1);
				$ts2 = strtotime($currentDate);

				$year1 = date('Y', $ts1);
				$year2 = date('Y', $ts2);

				$month1 = date('m', $ts1);
				$month2 = date('m', $ts2);
				
				$day3 = date('d', $ts1);
				$day4 = date('d', $ts2);

				$diff2 = (($year2 - $year1) * 12) + ($month2 - $month1);
				
				$month_diff = $diff2 - $diff1;
				
				if($month_diff!=0 && $day4<$day3)
				{
					$month_diff = $month_diff - 1;
				}
				
				$last_mth = $row['rentAmt'] - $row['tot'];
				
				$tot_rent = $row['rentAmt'] * $month_diff;
				
				$row['pending_rent'] = $tot_rent + $last_mth;
				
				$row['rent_d'] = array();
				
				$rent_d = new stdClass();
				$rent_d->month = $row['month'];
				$rent_d->amt = $last_mth;
				
				if($rent_d->amt!=0)
				{
					$row['rent_d'][] = $rent_d;
				}
				
				for($i=0;$i<12;$i++)
				{
					if(!strcmp($months[$i],$row['month']))
					{
						for($j=1;$j<=$month_diff;$j++)
						{
							
							$mth_index = $i+$j;
							
							if(($i+$j) == 12)
							{
								$mth_index = ($mth_index)%12;
							}
							
							$rent_d = new stdClass();
							$rent_d->month = $months[$mth_index];
							$rent_d->amt = $row['rentAmt'];
						
							$row['rent_d'][] = $rent_d;
						}
					}
				}
				
				$data['rent_details'][] = $row;
		}
		
		echo json_encode($data);
	}
	else if($ref==4)
	{
		$memberId = $request->memberId;
		
		$data = array();
	
		$data['rent_details'] = null;
		$data['member_rent'] = null;
		
		$sql1 = $conn->prepare("SELECT * FROM monthly_rent WHERE memberId = ?");
		$sql1->bind_param("i",$memberId);
		
		$sql1->execute();
		$result1 = $sql1->get_result();
		
		while($row1 = $result1->fetch_assoc())
		{	
				$row1['dateOfPay'] = date("d-m-Y", strtotime($row1['dateOfPay']));
	
				$data['rent_details'][] = $row1;
		}
		
		$sql2 = $conn->prepare("SELECT 
		members.name, members.contact, members.roomNo, rent_maintenance.id,
		rent_maintenance.rentAmt, rent_maintenance.depositAmt 
		FROM members INNER JOIN rent_maintenance ON members.id = rent_maintenance.memberId 
		WHERE members.id = ?");
		$sql2->bind_param("i",$memberId);
		
		$sql2->execute();
		$result2 = $sql2->get_result();
		
		while($row2 = $result2->fetch_assoc())
		{	
				$data['member_rent'][] = $row2;
		}
		
		echo json_encode($data);
	}
	else if($ref==5)
	{
		$id = $request->id;
		
		$sql = $conn->prepare("DELETE FROM monthly_rent WHERE id = ?");
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
		$rent_details = $request->rent_details;
		$member_rent = $request->member_rent;
		
		for($i=0;$i<count($rent_details);$i++)
		{
			$tmpMonth = date("m",strtotime($rent_details[$i]->month));
		
			$rentId = $rent_details[$i]->year.$tmpMonth.$member_rent[0]->id;
			
			$date = date("Y-m-d",strtotime($rent_details[$i]->dateOfPay));
		
			$sql1 = $conn->prepare("UPDATE monthly_rent SET month = ?,
			year = ?, paidAmt = ?, dateOfPay = ?, rentId = ?  WHERE id = ?");
			$sql1->bind_param("siisii", $rent_details[$i]->month, $rent_details[$i]->year,
							$rent_details[$i]->paidAmt, $date, $rentId, $rent_details[$i]->id);
							
			$sql1->execute();
		}
		
		$sql2 = $conn->prepare("UPDATE rent_maintenance SET rentAmt = ?,
			depositAmt = ? WHERE id = ?");
		$sql2->bind_param("iii", $member_rent[0]->rentAmt, $member_rent[0]->depositAmt, $member_rent[0]->id);
		
		if ($sql2->execute() === TRUE) 
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