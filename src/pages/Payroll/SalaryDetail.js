import React,{useRef} from 'react';
import EmployeeDetail from '../Employee/EmployeeDetail';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Link, useNavigate } from "react-router-dom";



export default function SalaryDetail() {
    const navigate = useNavigate();
    const pdfRef = useRef();
     const downloadPDF=()=>{
        console.log("download")
        console.log(pdfRef.current)
        const input = pdfRef.current;
        html2canvas(input).then((canvas)=>{
            const imgData=canvas.toDataURL('image/png');
            const pdf = new jsPDF('p','mm','a4',true);
            const pdfWidth=pdf.internal.pageSize.getWidth();
            const pdfHeight=pdf.internal.pageSize.getWidth();
            const imgWidth=canvas.width;
            const imgHeight=canvas.height;
            const ratio=Math.min(pdfWidth/imgWidth,pdfHeight/imgHeight);
            const imgX=(pdfWidth-imgWidth*ratio)/2;
            const imgY=30;
            pdf.addImage(imgData,'PNG',imgX,imgY,imgWidth*ratio,imgHeight*ratio);
            pdf.save('Salary.pdf')
        })
        
    }
    const back = () => {
        navigate(`/payroll`);
      };
  return (
    <div  style={{ width: '100%', padding: '20px', boxSizing: 'border-box' }}>
    <div ref={pdfRef} style={{ width: '100%' }}>
        <EmployeeDetail />
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button
            style={{
                backgroundColor: 'blue',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
            }}
            onClick={downloadPDF}
        >
            Download
        </button>
        <button
            style={{
                backgroundColor: 'blue',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                margin:' 0px 16px'
            }}
            onClick={back}
        >
                Back to Details
        </button>
    </div>
</div>
    
  )
}
