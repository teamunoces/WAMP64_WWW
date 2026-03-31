<?php
session_start();
$userDepartment = $_SESSION['department'] ?? '';
$reportType = isset($_GET['type']) ? htmlspecialchars($_GET['type']) : "Evaluation Sheet for Extension Services";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Evaluation Sheet for Extension Services</title>
    <link rel="stylesheet" href="evaluation.css">
</head>
<body>

  <!-- Header -->
   <iframe 
        src="../../Profile/profile.html" 
        id="headerFrame"
        frameborder="0"
        scrolling="no"
        title="Header">
    </iframe>

    <!-- Sidebar -->
    <iframe 
        src="../../Sidebar/sidebar.html" 
        id="sidebarFrame"
        frameborder="0"
        scrolling="no"
        title="Navigation Sidebar">
    </iframe>


    <div class="evaluation-container">
      
          <header>
            <div class="header-content">
                <img src="../images/smcclogo.png" alt="SMCC Logo" class="logo-left">
                <div class="college-info">
                    <h1>Saint Michael College of Caraga</h1>
                    <p>Brgy. 4, Nasipit, Agusan del Norte, Philippines</p>
                    <p>District 8, Brgy. Triangulo, Nasipit, Agusan del Norte, Philippines</p>
                    <p>Tel Nos. +63 085 343-3251 / +63 085 283-3113</p>
                    <a href="http://www.smccnasipit.edu.ph">www.smccnasipit.edu.ph</a>
                </div>
                <div class="logos-right">
                    <img src="../images/ISOlogo.png" alt="SOCOTEC Logo">
                </div>
            </div>
            <h2 class="office-title">OFFICE OF THE COMMUNITY EXTENSION SERVICES</h2>
            <div class="double-line"></div>
        </header>
        
        <header>
            <h1>EVALUATION SHEET FOR EXTENSION SERVICES</h1>
        </header>

        <section class="header-info">
            <div class="input-line">
                <label>Venue:</label>
                <input type="text" class="full-line">
            </div>
            <div class="input-line">
                <label>Implementing Department:</label>
                <input type="text" class="full-line">
            </div>
            <p><strong>Kindly put a check (/) mark on the type of extension service extended:</strong></p>
        </section>

        <section class="checkbox-grid">
            <div class="column">
                <label><input type="checkbox"> Reading Literacy and Numeracy Program</label>
                <label><input type="checkbox"> Sustainable Livelihood Program</label>
                <label><input type="checkbox"> Feeding Program</label>
                <label><input type="checkbox"> Recollection/Retreat</label>
                <label><input type="checkbox"> Lecture/Seminar</label>
            </div>
            <div class="column">
                <label><input type="checkbox"> Training and Workshop</label>
                <label><input type="checkbox"> Coastal Clean-Up drive</label>
                <label><input type="checkbox"> Tree Planting Program</label>
                <label><input type="checkbox"> Gardening Program</label>
                <label><input type="checkbox"> Community Clean-up Drive</label>
                <label><input type="checkbox"> Health/Crime Prevention/Environmental Awareness</label>
            </div>
        </section>

        <section class="instructions">
            <p><strong>Instruction:</strong> Rate each statement based on your current experience with the Extension Service Program. Choose the option that best reflects your level of agreement. Refer to the rating scale below.</p>
        </section>

        <table class="legend-table">
            <tr>
                <td class="score-cell">4</td>
                <td><strong>Strongly Agree</strong><br>Dako kaayo ang pag-uyon</td>
                <td><strong>Klaro nimo nga nakita ni sa programa. Nahitabo kini pirmi ug maayo ang pagdala.</strong><br><em>You clearly saw this in the program. It happened consistently and effectively.</em></td>
            </tr>
            <tr>
                <td class="score-cell">3</td>
                <td><strong>Agree</strong><br>Pag-uyon</td>
                <td><strong>Nakita nimo ni sa programa kadaghanan sa oras, pero dili kanunay.</strong><br><em>You saw this in the program most of the time, but not always.</em></td>
            </tr>
            <tr>
                <td class="score-cell">2</td>
                <td><strong>Disagree</strong><br>Walay pag-uyon</td>
                <td><strong>Bihira nimo kini makita sa programa. Kinahanglan pa kini og pagpaayo.</strong><br><em>You rarely saw this in the program. It needs improvement.</em></td>
            </tr>
            <tr>
                <td class="score-cell">1</td>
                <td><strong>Strongly Disagree</strong><br>Dili gyud pag-uyon</td>
                <td><strong>Wala gyud nimo kini makita sa programa. Wala kini gihimo o wala maangkon ang tumong.</strong><br><em>You did not see this in the program at all. It was not practiced or not achieved.</em></td>
            </tr>
        </table>

        <table class="evaluation-table">
            <thead>
                <tr>
                    <th></th>
                    <th class="num-col">4</th>
                    <th class="num-col">3</th>
                    <th class="num-col">2</th>
                    <th class="num-col">1</th>
                </tr>
            </thead>
            <tbody>
                <tr class="category-row"><td colspan="5">Program Relevance</td></tr>
                <tr>
                    <td>1. Ang programa mitubag sa tinuod nga panginahanglan sa komunidad.<br><em>The program addressed a real need in the community.</em></td>
                    <td></td><td></td><td></td><td></td>
                </tr>
                <tr>
                    <td>2. Klaro sa mga partisipante ang tumong sa programa.<br><em>The objectives of the program were clear to participants.</em></td>
                    <td></td><td></td><td></td><td></td>
                </tr>
                <tr>
                    <td>3. Ang mga kalihokan nagtugma sa tumong sa programa.<br><em>The activities matched the goals of the program.</em></td>
                    <td></td><td></td><td></td><td></td>
                </tr>

                <tr class="category-row"><td colspan="5">Planning and Organization</td></tr>
                <tr>
                    <td>4. Husto ang oras ug iskedyul sa programa.<br><em>The schedule and timing of the program were appropriate.</em></td>
                    <td></td><td></td><td></td><td></td>
                </tr>
                <tr>
                    <td>5. Ang mga materyales ug mga kapanguhaan sa programa igo ug sapat.<br><em>The program materials and resources were sufficient.</em></td>
                    <td></td><td></td><td></td><td></td>
                </tr>

                <tr class="category-row"><td colspan="5">Facilitation / Delivery</td></tr>
                <tr>
                    <td>6. Sayon sabton ang mga instruksyon ug impormasyon.<br><em>Instructions and information were easy to understand.</em></td>
                    <td></td><td></td><td></td><td></td>
                </tr>
                <tr>
                    <td>7. Ang programa nagdasig og aktibong pag-apil.<br><em>The program encouraged active participation.</em></td>
                    <td></td><td></td><td></td><td></td>
                </tr>
                <tr>
                    <td>8. Andam ug maalamon ang mga tigpasiugda.<br><em>The facilitators were prepared and knowledgeable.</em></td>
                    <td></td><td></td><td></td><td></td>
                </tr>
                <tr>
                    <td>9. Saktong gihatag ang oras aron maabot ang tumong sa programa.<br><em>The duration of the program was enough to meet the objectives.</em></td>
                    <td></td><td></td><td></td><td></td>
                </tr>
                <tr>
                    <td>10. Organisado ang mga kalihokan.<br><em>The activities were well organized.</em></td>
                    <td></td><td></td><td></td><td></td>
                </tr>

                <tr class="category-row"><td colspan="5">Learning Environment / Engagement</td></tr>
                <tr>
                    <td>11. Ang programa nakatukod og maayong lugar sa pagkaton.<br><em>The program created a positive learning environment.</em></td>
                    <td></td><td></td><td></td><td></td>
                </tr>
                <tr>
                    <td>12. Ang programa nagpasiugda og kooperasyon ug teamwork.<br><em>The program promoted teamwork and cooperation.</em></td>
                    <td></td><td></td><td></td><td></td>
                </tr>

                <tr class="category-row"><td colspan="5">Community Impact / Outcomes</td></tr>
                <tr>
                    <td>13. Ang programa nakatabang sa pagpauswag sa kahibalo o kahanas sa komunidad.<br><em>The program helped improve community knowledge or skills.</em></td>
                    <td></td><td></td><td></td><td></td>
                </tr>
                <tr>
                    <td>14. Klaro ang kaayohan nga nadawat sa komunidad.<br><em>The program had a visible benefit to the community.</em></td>
                    <td></td><td></td><td></td><td></td>
                </tr>

                <tr class="category-row"><td colspan="5">Satisfaction Level of the Beneficiary</td></tr>
                <tr>
                    <td>15. Kontento ko sa tibuok pagpatuman sa programa.<br><em>I am satisfied with the overall implementation of the program.</em></td>
                    <td></td><td></td><td></td><td></td>
                </tr>
            </tbody>
        </table>

        <footer class="signature-section">
            <div class="sig-line">Evaluated by: __________________________</div>
            <div class="sig-line">Signature: __________________________</div>
            <div class="sig-line">Date: __________________________</div>
        </footer>
    </div>

</body>
</html>