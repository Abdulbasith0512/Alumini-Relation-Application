// src/pages/PurchasePremium.jsx
import React,{useEffect,useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/user_navbar';

export default function PurchasePremium(){
  const [plans,setPlans]=useState([]);
  const [loading,setLoading]=useState(true);
  const navigate=useNavigate();

  useEffect(()=>{ axios.get('/api/plans')
    .then(r=>setPlans(Array.isArray(r.data)?r.data:[]))
    .catch(()=>setPlans([]))
    .finally(()=>setLoading(false));
  },[]);

  const buy = async id=>{
    try{
      const {data}=await axios.post(`/api/subscribe/${id}`);
      alert(data.message||'Subscription active');
      navigate('/');
    }catch(err){
      alert(err.response?.data?.error||'Purchase failed');
    }
  };

  if(loading) return <p style={{padding:20}}>Loading plans…</p>;

  return(
    <div>
      <Navbar />
    <div style={{padding:20,maxWidth:600,margin:'auto'}}>
      <h2>Premium Plans</h2>
      {plans.length===0 && <p>No plans available.</p>}
      {plans.map(p=>(
        <div key={p._id} style={{border:'1px solid #ccc',padding:15,marginBottom:12}}>
          <h3>{p.name}</h3>
          <p>Duration: {p.durationDays} days</p>
          <p>Price: ₹{p.price}</p>
          <button onClick={()=>buy(p._id)} style={btn}>Buy</button>
        </div>
      ))}
    </div>
    </div>
  );
}
const btn={padding:'8px 16px',background:'#28a745',color:'#fff',border:'none',cursor:'pointer'};
