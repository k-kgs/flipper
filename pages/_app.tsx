import "@/styles/globals.css";
import type { AppProps } from "next/app";
import BarcodeGame from "../components/BarcodeGame";

export default function Home() {
  return <BarcodeGame />;
}


// export default function App({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />;
// }
