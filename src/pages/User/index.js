/* eslint-disable react/state-in-constructor */
/* eslint-disable react/static-property-placement */
import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {
  Container,
  Name,
  Bio,
  Avatar,
  Header,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';
import api from '../../services/api';

export default class User extends Component {
  static propTypes = {
    route: PropTypes.shape(Object).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      setOptions: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 1,
    user: [],
    loading: true,
    refreshing: false,
  };

  async componentDidMount() {
    this.load();
  }

  load = async (page = 1) => {
    const {
      route: {
        params: {user},
      },
    } = this.props;

    const {stars} = this.state;

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {page},
    });

    this.setState({
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
      page,
      user,
      loading: false,
      refreshing: false,
    });
  };

  loadMore = () => {
    const {page} = this.state;

    const nextPage = page + 1;

    this.load(nextPage);
  };

  refreshList = () => {
    this.setState({refreshing: true, stars: []}, this.load);
  };

  handleNavigate = (repository) => {
    const {navigation} = this.props;

    console.tron.log(repository);

    navigation.navigate('Repository', {title: repository.name, repository});
  };

  render() {
    const {stars, user, loading, refreshing} = this.state;

    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <ActivityIndicator size="large" color="#7159c1" />
        ) : (
          <Stars
            data={stars}
            onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
            refreshing={refreshing} // Variável que armazena um estado true/false que representa se a lista está atualizando
            onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
            onEndReached={this.loadMore} // Função que carrega mais itens
            keyExtractor={(star) => String(star.id)}
            renderItem={({item}) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
