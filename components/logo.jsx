import Image from "next/image";

export default function Logo() {
  return (
    <div style={{ position: "relative", width: "100px", height: "100px" }}>
      <Image 
        src="/Logo.svg" 
        alt="Logo da empresa" 
        width={100} 
        height={100} 
        style={{ objectFit: "contain" }} 
      />
    </div>
  );
}