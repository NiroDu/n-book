# React Context 怎么用

## 示例 1 ：只取值不更改值

Dynamic Context：

`src/themed-context.js`

先用`React.createContext()`创建一个 Context 对象。

```js
import React from "react";

export const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

export const ThemeContext = React.createContext(themes.dark);
```

`src/themed-button.js`

在声明好类的`Class.contextType`后，可以从就近父级的 Provider 中使用`this.context`中取到 context 的值：

```js
import React, { Component } from "react";
import { ThemeContext } from "./theme-context";

class ThemedButton extends Component {
  render() {
    let props = this.props;
    let theme = this.context;
    return <button {...props} style={{ backgroundColor: theme.background }} />;
  }
}
ThemedButton.contextType = ThemeContext;

export default ThemedButton;
```

`src/index.js`

下面有两个按钮，一个用 Toolbar 封装，给它提供的值不是默认值。另外一个按钮直接使用默认值。

```js
import React, { Component } from "react";
import ReactDOM from "react-dom";

import { ThemeContext, themes } from "./theme-context";
import ThemedButton from "./themed-button";

// An intermediate component that uses the ThemedButton
function Toolbar(props) {
  return <ThemedButton onClick={props.changeTheme}>Change Theme</ThemedButton>;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: themes.light
    };
    this.toggleTheme = () => {
      this.setState(state => ({
        theme: state.theme === themes.dark ? themes.light : themes.dark
      }));
    };
  }
  render() {
    return (
      <div>
        <ThemeContext.Provider value={this.state.theme}>
          {/* 这里的 context Provider提供的值是'light'，不是createContext时的'dark'，所以这个按钮就近取值，显示为 light 按钮 */}
          <Toolbar changeTheme={this.toggleTheme} />
        </ThemeContext.Provider>
        <div>
          {/* 这里的context取createContext时的默认值'dark' */}
          <ThemedButton>normal button</ThemedButton>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
```

## 示例 2 ：从嵌套的组件里去更新 context 的值

关键是context返回一个函数

`src/themed-context.js`

```js
import React from "react";

export const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};
// 原来的：
// export const ThemeContext = React.createContext(themes.dark);

// Make sure the shape of the default value passed to createContext matches the shape that the consumers expect!
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {}
});
```

`src/theme-toggler-button.js`

```js
import React from "react";
import { ThemeContext } from "./theme-context";

function ThemeTogglerButton() {
  // The Theme Toggler Button receives not only the theme
  // but also a toggleTheme function from the context
  return (
    <ThemeContext.Consumer>
      {({ theme, toggleTheme }) => (
        <button
          onClick={toggleTheme}
          style={{ backgroundColor: theme.background }}
        >
          Toggle Theme
        </button>
      )}
    </ThemeContext.Consumer>
  );
}

export default ThemeTogglerButton;
```

`src/index.js`

```js
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { ThemeContext, themes } from "./theme-context";
import ThemeTogglerButton from "./theme-toggler-button";

function Content() {
  return (
    <div>
      <ThemeTogglerButton />
    </div>
  );
}
class App extends Component {
  constructor(props) {
    super(props);
    this.toggleTheme = () => {
      this.setState(state => ({
        theme: state.theme === themes.dark ? themes.light : themes.dark
      }));
    };
    // State also contains the updater function so it will
    // be passed down into the context provider
    this.state = {
      theme: themes.light,
      toggleTheme: this.toggleTheme
    };
  }
  render() {
    // The entire state is passed to the provider
    return (
      <ThemeContext.Provider value={this.state}>
        <Content />
      </ThemeContext.Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
```
