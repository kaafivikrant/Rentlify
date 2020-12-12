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
	
			$data['events'] = null;
			
			$sql = $conn->prepare("SELECT * FROM event_collection WHERE memberId = ?");
			$sql->bind_param("i",$memberId);
		
			
			$sql->execute();
			$result = $sql->get_result();
			
			while($row = $result->fetch_assoc())
			{
				$row['date'] = date("d-m-Y",strtotime($row['date']));
				$data['events'][] = $row;
			}
			
			echo json_encode($data);
		}
		else if($ref==2)
		{
			$data = array();
	
			$data['fine'] = null;
			
			$sql = $conn->prepare("SELECT * FROM fine_collection WHERE memberId = ?");
			$sql->bind_param("i",$memberId);
		
			
			$sql->execute();
			$result = $sql->get_result();
			
			while($row = $result->fetch_assoc())
			{
				$row['date'] = date("d-m-Y",strtotime($row['date']));
				$data['fine'][] = $row;
			}
			
			echo json_encode($data);
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
		else if($ref==4)
		{
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
		$months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

		$data = array();
		$tmpData = array();
	
		$data['pending_details'] = null;
		$tmpData= null;
		
		$sql2 = $conn->prepare("SELECT MAX(monthly_rent.rentId) as rentId, members.bId, 
				members.name, members.roomNo
				FROM monthly_rent inner JOIN rent_maintenance 
				on monthly_rent.memberId = rent_maintenance.memberId  
				INNER JOIN members on monthly_rent.memberId = members.id 
				GROUP by monthly_rent.memberId HAVING monthly_rent.memberId = ?");
		$sql2->bind_param("i", $memberId);
		
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
				
				$data['pending_details'][] = $row;
		}
		
		echo json_encode($data);
	}

		else if($ref==6)
		{	
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
	
		else if($ref==7)
		{
			$ppu = 10;
			
			$data = array();
			$tmpData = array();
		
			$data['bill_details'] = null;
			$tmpData= null;
		
			$sql2 = $conn->prepare("SELECT MAX(monthly_lightbill.billId) as billId, members.bId, 
					members.name, members.roomNo
					FROM monthly_lightbill
					INNER JOIN members on monthly_lightbill.memberId = members.id 
					GROUP by monthly_lightbill.memberId HAVING monthly_lightbill.memberId = ?");
			$sql2->bind_param("i", $memberId);
			
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
					AND  monthly_lightbill.billId = ?");
					$sql->bind_param("ii", $ppu, $row2['billId']);
					
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
?>
