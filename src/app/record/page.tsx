import { Metadata } from 'next';
import RecordPageOpener from './components/RecordPageOpener';

export const metadata: Metadata = {
  title: '闪念',
  description: '记录生活，遇见美好',
};

export default function RecordPage() {
  return <RecordPageOpener />;
}
