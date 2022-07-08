import { Divider, DotLoading } from 'antd-mobile';
import styles from './LoadingStatu.module.scss';

const LoadingStatu: React.FC<{ hasMore: boolean; list: string[] }> = ({
  hasMore,
  list,
}) => {
  return (
    <div className={styles.loading}>
      <Divider
        style={{
          color: '#444',
          borderColor: '#444',
          borderStyle: 'dashed',
        }}
      >
        {hasMore && list && list.length
          ? '加载中'
          : !hasMore && list && list.length > 0
          ? '没有更多了'
          : hasMore && list && list.length === 0
          ? null
          : '暂无消息记录'}
        {hasMore && <DotLoading color='#444' />}
      </Divider>
    </div>
  );
};
export default LoadingStatu;
