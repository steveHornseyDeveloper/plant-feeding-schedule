import { Drystone } from '../components/botanical/Drystone';

type Props = {
  intensity?: number;
  w?: number;
};

export function DrystoneDivider({ intensity = 1, w = 350 }: Props) {
  if (intensity <= 0) return <div style={{ height: 8 }} />;
  return (
    <div
      style={{
        padding: '6px 16px 10px',
        opacity: 0.55 + intensity * 0.45,
        filter: `saturate(${0.6 + intensity * 0.4})`,
      }}
    >
      <Drystone rows={2} w={w} h={18 + intensity * 6} intensity={intensity} />
    </div>
  );
}
