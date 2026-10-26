import './index.scss';

interface Props {
  author?: string;
}

// 封面正脸：门外合着的本子、门里合上时扣下来的硬壳共用这一块布面
export default function DiaryCoverFront({ author }: Props) {
  return (
    <span className="diary-cover-front">
      <span aria-hidden className="diary-cover-spine" />
      <span className="diary-cover-body">
        <span className="diary-cover-slip">
          <span className="diary-cover-title">日记本</span>
          {author ? <span className="diary-cover-author">{author} 记</span> : null}
        </span>
      </span>
      <span aria-hidden className="diary-cover-seal">慎独</span>
    </span>
  );
}
