# all-commit

**目的**: 一連のフローの自動実行
**実行フロー**:
以下の順序でプロトコルを連鎖実行する。
1. `Protocol: /branch` を実行
2. `Protocol: /commit` を実行
3. `Protocol: /pr` を実行
