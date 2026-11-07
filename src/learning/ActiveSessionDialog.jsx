import bubbleConfused from '../assets/characters/bubble-confused.png';
import Button from '../components/Button/Button';
import Dialog from '../components/Dialog/Dialog';

export default function ActiveSessionDialog({ conflict, starting, onReplace, onResume, onClose }) {
  const name = conflict?.current?.concept?.name;

  return (
    <Dialog
      open={Boolean(conflict)}
      onClose={onClose}
      character={<img src={bubbleConfused} alt="" width="56" height="56" />}
      title="진행 중인 학습이 있어요"
      actions={
        <>
          <Button size="md" variant="secondary" onClick={onReplace} disabled={starting}>
            새로 시작
          </Button>
          <Button size="md" onClick={onResume} disabled={starting}>
            이어서 하기
          </Button>
        </>
      }
    >
      {name ? `"${name}" 학습이 아직 끝나지 않았어요.` : '아직 끝나지 않은 학습이 있어요.'}
      <br />
      새로 시작하면 이전 학습은 그만두게 돼요.
    </Dialog>
  );
}
