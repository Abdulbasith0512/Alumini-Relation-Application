import Navbar from "../components/navbar";
import './B_home_page.css';
import homePerson from '../assets/home_person.png';



function HomePage() {
  return (
    <div>
      <Navbar />
      <div class="profile-container">
  <div class="profile-text">
    <h1>RAJ SHARMA</h1>
    <p>
      Raj Sharma is a passionate software engineer from the Class of 2020, known for his
      innovative projects and leadership in the college tech club. Currently working at Infosys,
      he actively mentors juniors and contributes to open-source. Raj enjoys building scalable
      web applications and staying updated with the latest in tech.
    </p>
    <div class="buttons">
      <button class="btn-dark">JOIN US</button>
      <button class="btn-outline">EXPLORE MORE</button>
    </div>
  </div>
  <div class="profile-image">
    <img src={homePerson} alt="Raj Sharma" />
  </div>
</div>
<div class="analysis-container">
  <div class="analysis-card">
    <h2>34.7k+</h2>
    <p>ALumini across PG and AMP Suites,FPM and EFPM</p>
  </div>
  <div class="analysis-card">
    <h2>210+</h2>
    <p>International Events Organized by the Alumni Community</p>
  </div>
  <div class="analysis-card">
    <h2>460+</h2>
    <p>Jobs Offered by the vast community of the Alumni</p>
  </div>
  <div class="analysis-card">
    <h2>26+</h2>
    <p>Countries with the Alumni across the world</p>
  </div>
  
</div>

    </div>
  );
}
export default HomePage;