import React from 'react';
import { View, Text } from '@tarojs/components';
import { AtLoadMore, AtIcon, AtToast } from 'taro-ui';
import { PageStatusType } from 'src/store/common/pages';
import { observer } from 'mobx-react';
import { classnames } from 'src/utils';
import { PageStoresType, paegStoresKey } from 'src/store';

import styles from './pageStatus.module.scss';

/* 该组件在每个pages页面引用，可以控制页面加载状态，出错状态，以及toast公用 */

function PageStatusComp(props: PageStatusType) {
  const { toast, loading, error } = props;
  const pageStatusClass = classnames({
    [styles['page-status-wrap']]: true,
    [styles['page-status-wrap-toast']]: !loading && !error
  });
  return (
    <View className={pageStatusClass}>
      <AtToast {...toast} />
      {loading && <AtLoadMore status="loading" loadingText="加载中，请稍后" />}
      {error && (
        <View className={styles['pages-status-error-wrap']}>
          <AtIcon value="subtract-circle" size="30" color="#e5243e" />
          <Text className={styles['pages-status-error-text']}>
            页面加载失败，请联系管理员
          </Text>
        </View>
      )}
    </View>
  );
}

const pageStatusHoc = (pageStoreType: paegStoresKey) => (
  WrappedComp: React.ComponentClass
): any =>
  // observer只包括最直接的组件，这里pageStatusHoc本身用到了observable的数据pageStatus，WrappedComp也用到了store层数据，所以在这里observer。
  // 页面级别的地方因此不再需要observer
  observer(
    class extends WrappedComp {
      render() {
        const curPageStore = this.props[pageStoreType] as PageStoresType;
        const { pageStatus } = curPageStore;
        return (
          <View>
            {super.render()}
            <PageStatusComp {...pageStatus} />
          </View>
        );
      }
    }
  );

export default pageStatusHoc;
