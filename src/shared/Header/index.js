import React, { Component } from 'react';
import { Header, Left, Button, Icon, Body, Right, Title } from "native-base";
import {style as hs} from './style';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";

class HeaderComponent extends Component {

	handleMenuAction = () => {
		if(this.props.onBack) return this.props.onBack()
		return this.props.navigation.goBack();
	}

	handleEllipseMenu = (value) => {
		let { onEllipseItemClick } = this.props;
		if(onEllipseItemClick) return onEllipseItemClick(value);
		return true;
	}

	render() {
		let { title, children, isBack, isEllipseMenu, ellipseMenu, style } = this.props;
		return (
			<Header style = {{...hs.header, ...style}}>
				{isBack &&
					<Left>
						<Button
							transparent
							onPress={this.handleMenuAction}>
								<Icon type="FontAwesome" name={"chevron-left" } style = {hs.text}/>
						</Button>
					</Left>	
				}
				<Body>
					<Title style = {hs.text}>{title}</Title>
				</Body>
				<Right>
					{children}
					{isEllipseMenu &&
						<Menu onSelect={this.handleEllipseMenu}>
							<MenuTrigger style={hs.ellipseMenuTrigger}>
								<Icon type="FontAwesome" name="ellipsis-v" style={hs.ellipseIcon}/>
							</MenuTrigger>
							<MenuOptions style={hs.ellipseMenuOptions}>
								{ellipseMenu && 
									ellipseMenu.map((el, i) => 
										<MenuOption 
											key={el.title + i} 
											customStyles={{optionText: hs.ellipseMenuOptionItem}} 
											value={el.value || el.title || el} 
											text={el.title || el}
										/>
									
								)}
							</MenuOptions>
						</Menu>
					}
				</Right>
			</Header>
		);
	}
}

export default HeaderComponent;